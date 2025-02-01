const express = require("express");
const multer = require("multer");
const { Appliance, bucket } = require("../db");
const { authMiddleware } = require("../authMiddleware");
const zod = require("zod");
const { ObjectId } = require("mongodb");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('only JPEG, PNG and PDF files are allowed'), false);
    }
    cb(null, true);
  },
  limits: {fileSize: 5 * 1024 * 1024},
});

const applianceSchema = zod.object({
  name: zod.string().min(1, "Name is required"),
  modelNumber: zod.string().min(1, "Model number is required"),
  purchaseDate: zod.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  })
});

router.post("/add", authMiddleware, upload.fields([
  { name: "productImage", maxCount: 1 },
  { name: "originalReceipt", maxCount: 1 },
  { name: "insuranceReceipt", maxCount: 1 },
]), async (req, res) => {
  // Ensure bucket is initialized
  if (!bucket) {
    console.error('GridFS bucket not initialized');
    return res.status(500).json({
      message: "Server is not ready to handle file uploads",
      details: "Ensure MongoDB is running and GridFS is initialized",
    });
  }
  try {
    console.log('Received add appliance request');
    console.log('Request body:', req.body);
    console.log('Files received:', req.files);

    if (!req.files || !req.files["originalReceipt"]) {
      console.error('Missing original receipt');
      return res.status(400).json({
        message: "Original receipt is required"
      });
    }

    // Improved date parsing and validation
    let purchaseDate;
    try {
      purchaseDate = new Date(`${req.body.purchaseDate}`);
      console.log('Parsed purchase date:', purchaseDate);
      if (isNaN(purchaseDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      console.error('Date parsing error:', error, 'Input date:', req.body.purchaseDate);
      return res.status(400).json({
        message: "Invalid date format",
        details: `Unable to parse date: ${req.body.purchaseDate}`
      });
    }

    console.log('Validating input data...');
    const { success, data, error } = applianceSchema.safeParse({
      ...req.body,
      purchaseDate: purchaseDate.toISOString()
    });
    if (!success) {
      console.error('Validation errors:', error.errors);
      return res.status(400).json({
        message: "Invalid input data",
        errors: error.errors,
      });
    }

    if (!req.files["productImage"]) {
      console.error('Missing product image');
      return res.status(400).json({
        message: "Product image is required"
      });
    }

    console.log('Uploading product image...');
    const productImageId = new ObjectId();
    try {
      const productImageUploadStream = bucket.openUploadStreamWithId(productImageId, req.files["productImage"][0].originalname);
      await new Promise((resolve, reject) => {
        productImageUploadStream.end(req.files["productImage"][0].buffer, async (error) => {
          if (error) {
            console.error('Error uploading product image:', error);
            reject(error);
          }
          resolve();
        });
      });
    } catch (error) {
      console.error('Error initializing product image upload:', error);
      return res.status(500).json({
        message: "Error uploading product image",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    console.log('Uploading original receipt...');
    const originalReceiptId = new ObjectId();
    const uploadStream = bucket.openUploadStreamWithId(originalReceiptId, req.files["originalReceipt"][0].originalname);
    await new Promise((resolve, reject) => {
      uploadStream.end(req.files["originalReceipt"][0].buffer, async (error) => {
        if (error) {
          console.error('Error uploading original receipt:', error);
          reject(error);
        }
        resolve();
      });
    });

    let insuranceReceiptId;
    if (req.files["insuranceReceipt"]) {
      console.log('Uploading insurance receipt...');
      insuranceReceiptId = new ObjectId();
      const insuranceUploadStream = bucket.openUploadStreamWithId(insuranceReceiptId, req.files["insuranceReceipt"][0].originalname);
      await new Promise((resolve, reject) => {
        insuranceUploadStream.end(req.files["insuranceReceipt"][0].buffer, async (error) => {
          if (error) {
            console.error('Error uploading insurance receipt:', error);
            reject(error);
          }
          resolve();
        });
      });
    }

    console.log('Creating appliance record...');
    const appliance = await Appliance.create({
      userId: req.userId,
      name: data.name,
      modelNumber: data.modelNumber,
      purchaseDate: new Date(data.purchaseDate),
      productImage: productImageId,
      receipts: [
        {
          name: req.body.originalReceiptType || "Original Receipt",
          file: originalReceiptId
        },
        ...(insuranceReceiptId ? [{
          name: req.body.insuranceReceiptType || "Insurance Receipt",
          file: insuranceReceiptId
        }] : [])
      ]
    });

    console.log('Appliance created successfully:', appliance);
    res.json({
      message: "Appliance added successfully!",
      appliance,
    });
  } catch (error) {
    console.error('Error in add appliance route:', error);
    res.status(500).json({
      message: "Error adding appliance",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get("/get", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";

  const appliances = await Appliance.find({
    $or: [{
      name: {
        "$regex": filter
      }
    }]
  })

  res.json({
    appliance : appliances.map(appliance => ({
      name: appliance.name,
      id: appliance._id,
    }))
  })
})

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { success, data } = applianceSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: error.errors,
      });
    }

    const updatedAppliance = await Appliance.findByIdAndUpdate(
      req.params.id,
      {
        ...data,
      },
      { new: true }
    );

    if (!updatedAppliance) {
      return res.status(404).json({
        message: "Appliance not found",
      });
    }

    res.json({
      message: "Appliance updated successfully!",
      appliance: updatedAppliance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appliance",
      error: error.message,
    });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const appliance = await Appliance.findById(req.params.id);

    if (!appliance) {
      return res.status(404).json({
        message: "Appliance not found"
      });
    }

    res.json({
      appliance: {
        _id: appliance._id,
        name: appliance.name,
        modelNumber: appliance.modelNumber,
        purchaseDate: appliance.purchaseDate,
        productImage: appliance.productImage,
        receipts: appliance.receipts
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appliance",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get("/files/:fileId", async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.fileId);
    const downloadStream = bucket.openDownloadStream(fileId);
    
    downloadStream.on('error', () => {
      res.status(404).json({ message: "File not found" });
    });

    res.set('Content-Type', 'application/octet-stream');
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      message: "Error downloading file",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const appliance = await Appliance.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!appliance) {
      return res.status(404).json({
        message: "Appliance not found or unauthorized"
      });
    }

    await Appliance.findByIdAndDelete(req.params.id);

    res.json({
      message: "Appliance deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting appliance",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.put("/:id/receipt", authMiddleware, upload.single("originalReceipt"), async (req, res) => {
  try {
    const appliance = await Appliance.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!appliance) {
      return res.status(404).json({
        message: "Appliance not found or unauthorized"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Receipt file is required"
      });
    }

    const fileId = new ObjectId();
    const uploadStream = bucket.openUploadStreamWithId(fileId, req.file.originalname);
    await new Promise((resolve, reject) => {
      uploadStream.end(req.file.buffer, async (error) => {
        if (error) reject(error);
        resolve();
      });
    });

    appliance.receipts.push({
      name: req.body.name,
      type: req.body.type,
      file: fileId
    });

    await appliance.save();

    res.json({
      message: "Receipt added successfully",
      appliance
    });
  } catch (error) {
    console.error('Error adding receipt:', error);
    res.status(500).json({
      message: "Error adding receipt",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


module.exports = router;