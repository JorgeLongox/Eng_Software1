const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/views/cadastro.html", userController.renderCadastro);
router.post("/cadastro", userController.cadastro);
router.get("/views/esq_senha.html", userController.renderEsqSenha);
router.post("/views/esq_senha", userController.esqueceuSenha);

module.exports = router;
