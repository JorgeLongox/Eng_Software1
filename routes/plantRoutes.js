const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");

router.get("/views/home.html", plantController.renderHome);

router.get("/api/plantas", plantController.getPlant);

module.exports = router;