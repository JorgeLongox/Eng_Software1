const express = require("express");
const router = express.Router();
const googleAuthController = require("../controllers/googleAuthController");

router.post("/google-login", googleAuthController.googleLogin);

module.exports = router;