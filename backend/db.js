const express = require("express");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let bucket;
let isInitialized = false;

// Create a promise-based connection
const connectDB = async () => {
  if (isInitialized) return bucket;

  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/receipts");
    console.log('MongoDB Connected');

    let retryCount = 0;
    const maxRetries = 5;

    while (!isInitialized && retryCount < maxRetries) {
      try {
        if (mongoose.connection.db) {
          bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
          });
          isInitialized = true;
          console.log('GridFS bucket initialized');
          return bucket;
        }
      } catch (err) {
        console.error(`Attempt ${retryCount + 1} failed to initialize bucket:`, err);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      retryCount++;
    }

    if (!isInitialized) {
      console.error('Failed to initialize GridFS bucket after multiple attempts');
      process.exit(1);  // Exit the server if bucket fails to initialize
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};


// Connect to MongoDB and initialize bucket
connectDB().catch(error => {
  console.error('Failed to initialize bucket:', error);
  process.exit(1);
});

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
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  receipts: [{
    name: {
      type: String,
      require: true,
      trim: true
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      require: true
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

module.exports = { User, Account, Appliance, bucket }