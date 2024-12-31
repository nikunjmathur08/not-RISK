const express = require("express");
const userRoute = require("./user");
const applianceRoute = require("./appliance");

const router = express.Router();

router.use("/user", userRoute);
router.use("/appliance", applianceRoute);

module.exports = router;