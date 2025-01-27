const express = require("express");
const userRoute = require("./user");
const productRoute = require("./product");
const receiptRoute = require("./receipt");

const router = express.Router();

router.use("/user", userRoute);
router.use("/products", productRoute);
router.use("/receipts", receiptRoute);

module.exports = router;