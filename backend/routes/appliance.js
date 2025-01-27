const express = require("express");
const multer = require("multer");
const { Appliance } = require("../db");
const { authMiddleware } = require("../authMiddleware");
const zod = require("zod");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
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
  name: zod.string(),
  purchaseDate: zod.string()
});

router.post("/add", authMiddleware, upload.fields([
  { name: "originalReceipt", maxCount: 1 },
  { name: "insuranceReceipt", maxCount: 1 },
]), async (req, res) => {
  try {
    const { success, data } = applianceSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Inavlid input data",
        errors: error.errors,
      });
    }

    const appliance = await Appliance.create({
      userId: req.userId,
      name: data.name,
      purchaseDate: data.purchaseDate,
      originalReceipt: req.files["originalReceipt"]?.[0]?.path || null,
      insuranceReceipt: req.files["insuranceReceipt"]?.[0]?.path || null,
    });

    res.json({
      message: "Appliance added successfully!",
      appliance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding appliance",
      error: error.message,
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

module.exports = router;