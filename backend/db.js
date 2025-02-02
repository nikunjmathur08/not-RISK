const express = require("express");
const mongoose = require("mongoose");

// Create a promise-based connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/receipts");
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    trim: true
  },
  lastName: {
    type: String,
    require: true,
    trim: true,
    maxLength: 50
  },
  username: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30
  },
  password: {
    type: String,
    require: true,
    minLength: 6
  }
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

const applianceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  name: {
    type: String,
    require: true,
    trim: true
  },
  modelNumber: {
    type: String,
    require: true,
    trim: true
  },
  purchaseDate: {
    type: Date,
    require: true
  },
  productImage: {
    data: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true,
      max: 5 * 1024 * 1024 // 5MB limit
    }
  },
  receipts: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    data: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true,
      max: 5 * 1024 * 1024 // 5MB limit
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
});

const User = new mongoose.model("User", userSchema)
const Account = new mongoose.model("Account", accountSchema)
const Appliance = new mongoose.model("Appliance", applianceSchema)

module.exports = { User, Account, Appliance }