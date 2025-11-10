const express = require("express");
const multer = require("multer");
const { db, supabase } = require("../db");
const { authMiddleware } = require("../authMiddleware");
const { compressBuffer, decompressBuffer } = require("../utils/compression");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

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
      content_type: productImage.mimetype,
      file_name: productImage.originalname,
      file_size: productImage.size
    };

    const originalReceipt = req.files["originalReceipt"][0];
    const compressedOriginalReceipt = await compressBuffer(originalReceipt.buffer);
    const originalReceiptData = {
      name: req.body.originalReceiptType || "Original Receipt",
      data: compressedOriginalReceipt.toString('base64'),
      content_type: originalReceipt.mimetype,
      file_name: originalReceipt.originalname,
      file_size: originalReceipt.size
    };

    let insuranceReceiptData;
    if (req.files["insuranceReceipt"]) {
      const insuranceReceipt = req.files["insuranceReceipt"][0];
      const compressedInsuranceReceipt = await compressBuffer(insuranceReceipt.buffer);
      insuranceReceiptData = {
        name: req.body.insuranceReceiptType || "Insurance Receipt",
        data: compressedInsuranceReceipt.toString('base64'),
        content_type: insuranceReceipt.mimetype,
        file_name: insuranceReceipt.originalname,
        file_size: insuranceReceipt.size
      };
    }

    const appliance = await db.appliances.create({
      user_id: req.userId,
      name: data.name,
      model_number: data.modelNumber,
      company_name: data.companyName,
      purchase_date: purchaseDate.toISOString(),
      product_image_data: productImageData.data,
      product_image_content_type: productImageData.content_type,
      product_image_file_name: productImageData.file_name,
      product_image_file_size: productImageData.file_size
    });

    // Create receipts
    await db.receipts.create({
      appliance_id: appliance.id,
      name: originalReceiptData.name,
      data: originalReceiptData.data,
      content_type: originalReceiptData.content_type,
      file_name: originalReceiptData.file_name,
      file_size: originalReceiptData.file_size
    });

    if (insuranceReceiptData) {
      await db.receipts.create({
        appliance_id: appliance.id,
        name: insuranceReceiptData.name,
        data: insuranceReceiptData.data,
        content_type: insuranceReceiptData.content_type,
        file_name: insuranceReceiptData.file_name,
        file_size: insuranceReceiptData.file_size
      });
    }

    // Fetch appliance with receipts
    const applianceWithReceipts = await db.appliances.findById(appliance.id);
    const receipts = await db.receipts.findByApplianceId(appliance.id);

    res.json({
      message: "Appliance added successfully!",
      appliance: {
        ...applianceWithReceipts,
        receipts: receipts
      }
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
  try {
    console.log('Fetching appliances for userId:', req.userId, 'Type:', typeof req.userId);
    const filter = req.query.filter || "";

    const appliances = await db.appliances.find({
      userId: req.userId,
      $or: filter ? [{
        name: {
          "$regex": filter,
          "$options": "i"
        }
      }] : []
    })

    // Ensure appliances is always an array
    const appliancesArray = Array.isArray(appliances) ? appliances : [];

    const decompressedAppliances = await Promise.all(
      appliancesArray.map(async appliance => {
        try {
          // Safety check for required fields
          if (!appliance || !appliance.product_image_data) {
            console.error('Invalid appliance data:', appliance);
            return null;
          }

          const decompressedImageData = Buffer.from(appliance.product_image_data, 'base64');
          const decompressedImage = await decompressBuffer(decompressedImageData);
          return {
            name: appliance.name,
            id: appliance.id,
            companyName: appliance.company_name,
            productImage: {
              data: decompressedImage.toString('base64'),
              contentType: appliance.product_image_content_type,
              fileName: appliance.product_image_file_name,
              fileSize: appliance.product_image_file_size
            }
          };
        } catch (error) {
          console.error(`Error processing image for appliance ${appliance?.id}:`, error);
          // Return the appliance with the original image data if decompression fails
          return {
            name: appliance.name,
            id: appliance.id,
            companyName: appliance.company_name,
            productImage: {
              data: appliance.product_image_data,
              contentType: appliance.product_image_content_type,
              fileName: appliance.product_image_file_name,
              fileSize: appliance.product_image_file_size
            }
          };
        }
      })
    );

    // Filter out any null values
    const validAppliances = decompressedAppliances.filter(app => app !== null);

    res.json({
      appliance: validAppliances
    })
  } catch (error) {
    console.error('Error in get appliances route:', error);
    res.status(500).json({
      message: "Error fetching appliances",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
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

    const updateData = {
      name: data.name,
      model_number: data.modelNumber,
      company_name: data.companyName || null,
      purchase_date: new Date(data.purchaseDate).toISOString()
    };

    const updatedAppliance = await db.appliances.findByIdAndUpdate(
      req.params.id,
      updateData
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
      message: "Error updating appliance",
      error: error.message,
    });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const appliance = await db.appliances.findById(req.params.id);

    if (!appliance) {
      return res.status(404).json({
        message: "Appliance not found"
      });
    }

    // Verify ownership
    if (appliance.user_id !== req.userId) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    const decompressedImageData = Buffer.from(appliance.product_image_data, 'base64');
    const decompressedImage = await decompressBuffer(decompressedImageData);

    const receipts = await db.receipts.findByApplianceId(appliance.id);

    res.json({
      appliance: {
        _id: appliance.id,
        name: appliance.name,
        modelNumber: appliance.model_number,
        purchaseDate: appliance.purchase_date,
        companyName: appliance.company_name || null,
        productImage: {
          data: decompressedImage.toString('base64'),
          contentType: appliance.product_image_content_type,
          fileName: appliance.product_image_file_name,
          fileSize: appliance.product_image_file_size
        },
        receipts: receipts.map(r => ({
          _id: r.id,
          name: r.name,
          data: r.data,
          contentType: r.content_type,
          fileName: r.file_name,
          fileSize: r.file_size,
          createdAt: r.created_at
        }))
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
    console.log('Deleting appliance:', req.params.id, 'for user:', req.userId);
    
    const appliance = await db.appliances.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!appliance) {
      console.log('Appliance not found or unauthorized');
      return res.status(404).json({
        message: "Appliance not found or unauthorized"
      });
    }

    console.log('Found appliance, deleting receipts...');
    
    // Delete receipts first using Supabase directly
    const receipts = await db.receipts.findByApplianceId(req.params.id);
    console.log('Found receipts:', receipts?.length || 0);
    
    if (receipts && receipts.length > 0) {
      const { error: receiptsError } = await supabase
        .from('receipts')
        .delete()
        .eq('appliance_id', req.params.id);
      
      if (receiptsError) {
        console.error('Error deleting receipts:', receiptsError);
        // Continue with appliance deletion even if receipt deletion fails
      } else {
        console.log('Receipts deleted successfully');
      }
    }

    console.log('Deleting appliance...');
    await db.appliances.findByIdAndDelete(req.params.id);
    console.log('Appliance deleted successfully');

    res.json({
      message: "Appliance deleted successfully"
    });
  } catch (error) {
    console.error('Error in delete appliance route:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      message: "Error deleting appliance",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.put("/:id/receipt", authMiddleware, upload.single("originalReceipt"), async (req, res) => {
  try {
    const appliance = await db.appliances.findOne({
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
      appliance_id: appliance.id,
      name: req.body.name || "Additional Receipt",
      data: req.file.buffer.toString('base64'),
      content_type: req.file.mimetype,
      file_name: req.file.originalname,
      file_size: req.file.size
    };

    await db.receipts.create(receiptData);

    const updatedAppliance = await db.appliances.findById(appliance.id);
    const receipts = await db.receipts.findByApplianceId(appliance.id);

    res.json({
      message: "Receipt added successfully",
      appliance: {
        ...updatedAppliance,
        receipts: receipts
      }
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

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const appliance = await db.appliances.findOne({
      _id: req.params.id,
      userId: userId
    });

    if (!appliance) {
      return res.status(404).json({
        message: "Appliance not found or unauthorized"
      });
    }

    const receipt = await db.receipts.findById(req.params.receiptId);

    if (!receipt || receipt.appliance_id !== appliance.id) {
      return res.status(404).json({
        message: "Receipt not found"
      });
    }

    res.setHeader('Content-Type', receipt.content_type);
    res.setHeader('Content-Disposition', `inline; filename="${receipt.file_name || 'receipt'}"`); 
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