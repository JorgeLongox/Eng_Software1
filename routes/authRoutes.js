const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/", authController.renderHomepage);
router.get("/views/login.html", authController.renderLogin);
router.get("/views/conta.html", authController.renderConta);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;