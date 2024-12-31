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

const applicanceSchema = new mongoose.Schema({
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
  purchaseDate: {
    type: Date,
    require: true
  },
  originalReceipt: {
    type: String,
    require: false
  },
  insuranceReceipt: {
    type: String,
    require: false
  },
  additionReceipts: [{
    type: String,
    require: false
  }]
});

const User = new mongoose.model("User", userSchema)
const Account = new mongoose.model("Account", accountSchema)
const Appliance = new mongoose.model("Appliance", applicanceSchema)

module.exports = { User, Account, Appliance }