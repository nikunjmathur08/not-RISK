const express = require("express");
const mongoose = require("mongoose");
const { type } = require("os");
mongoose.connect("mongodb://localhost:27017/receipts");

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
    type: String,
    require: true
  },
  receipts: [{
    name: {
      type: String,
      require: true,
      trim: true
    },
    file: {
      type: String,
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

module.exports = { User, Account, Appliance }