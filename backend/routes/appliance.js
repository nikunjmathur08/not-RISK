const express = require("express");
const multer = require("multer");
const { Appliance } = require("../db");
const { authMiddleware } = require("../authMiddleware");
const { compressBuffer, decompressBuffer } = require("../utils/compression");
const zod = require("zod");
const jwt = require("jsonwebtoken");

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
  companyName: zod.string().nullable().optional(),
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
  try {

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

    const productImage = req.files["productImage"][0];
    const compressedProductImage = await compressBuffer(productImage.buffer);
    const productImageData = {
      data: compressedProductImage.toString('base64'),
      contentType: productImage.mimetype,
      fileName: productImage.originalname,
      fileSize: productImage.size
    };

    const originalReceipt = req.files["originalReceipt"][0];
    const compressedOriginalReceipt = await compressBuffer(originalReceipt.buffer);
    const originalReceiptData = {
      name: req.body.originalReceiptType || "Original Receipt",
      data: compressedOriginalReceipt.toString('base64'),
      contentType: originalReceipt.mimetype,
      fileName: originalReceipt.originalname,
      fileSize: originalReceipt.size
    };

    let insuranceReceiptData;
    if (req.files["insuranceReceipt"]) {
      const insuranceReceipt = req.files["insuranceReceipt"][0];
      const compressedInsuranceReceipt = await compressBuffer(insuranceReceipt.buffer);
      insuranceReceiptData = {
        name: req.body.insuranceReceiptType || "Insurance Receipt",
        data: compressedInsuranceReceipt.toString('base64'),
        contentType: insuranceReceipt.mimetype,
        fileName: insuranceReceipt.originalname,
        fileSize: insuranceReceipt.size
      };
    }

    const appliance = await Appliance.create({
      userId: req.userId,
      name: data.name,
      modelNumber: data.modelNumber,
      companyName: data.companyName,
      purchaseDate: new Date(data.purchaseDate),
      productImage: productImageData,
      receipts: [
        originalReceiptData,
        ...(insuranceReceiptData ? [insuranceReceiptData] : [])
      ]
    });

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
    userId: req.userId,
    $or: [{
      name: {
        "$regex": filter,
        "$options": "i"
      }
    }]
  })

  const decompressedAppliances = await Promise.all(appliances.map(async appliance => {
    try {
      const decompressedImageData = Buffer.from(appliance.productImage.data, 'base64');
      const decompressedImage = await decompressBuffer(decompressedImageData);
      return {
        name: appliance.name,
        id: appliance._id,
        companyName: appliance.companyName,
        productImage: {
          ...appliance.productImage,
          data: decompressedImage.toString('base64')
        }
      };
    } catch (error) {
      console.error(`Error processing image for appliance ${appliance._id}:`, error);
      // Return the appliance with the original image data if decompression fails
      return {
        name: appliance.name,
        id: appliance._id,
        companyName: appliance.companyName,
        productImage: appliance.productImage
      };
    }
  }));

  res.json({
    appliance: decompressedAppliances
  })
})

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { success, data, error } = applianceSchema.safeParse(req.body);
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
        companyName: data.companyName || null
      },
      { new: true, runValidators: true }
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

    const decompressedImageData = Buffer.from(appliance.productImage.data, 'base64');
    const decompressedImage = await decompressBuffer(decompressedImageData);

    res.json({
      appliance: {
        _id: appliance._id,
        name: appliance.name,
        modelNumber: appliance.modelNumber,
        purchaseDate: appliance.purchaseDate,
        companyName: appliance.companyName || null,
        productImage: {
          ...appliance.productImage,
          data: decompressedImage.toString('base64')
        },
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

    const receiptData = {
      name: req.body.name || "Additional Receipt",
      data: req.file.buffer.toString('base64'),
      contentType: req.file.mimetype,
      fileName: req.file.originalname,
      fileSize: req.file.size
    };

    appliance.receipts.push(receiptData);
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

router.get("/:id/receipt/:receiptId", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token and get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const appliance = await Appliance.findOne({
      _id: req.params.id,
      userId: userId
    });

    if (!appliance) {
      return res.status(404).json({
        message: "Appliance not found or unauthorized"
      });
    }

    const receipt = appliance.receipts.find(r => r._id.toString() === req.params.receiptId);

    if (!receipt) {
      return res.status(404).json({
        message: "Receipt not found"
      });
    }

    res.setHeader('Content-Type', receipt.contentType);
    res.setHeader('Content-Disposition', `inline; filename="${receipt.fileName || 'receipt'}"`); 
    const compressedBuffer = Buffer.from(receipt.data, 'base64');
    const decompressedBuffer = await decompressBuffer(compressedBuffer);
    res.send(decompressedBuffer);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({
      message: "Error fetching receipt",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;