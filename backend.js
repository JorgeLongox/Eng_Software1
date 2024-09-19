const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./bd/config.js");
require("dotenv").config();
const app = express();
const port = 9000;
const path = require("path");
const nodemailer = require("nodemailer");
const session = require("express-session");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/public", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "/views"));

// Configuração de sessão
app.use(
  session({
    secret: "hnouihwaiubkniurgiqobvdibaiurbily7s57sfvrv545sdv",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, //como não estamos usando https é false
  })
);

//configurando Nodemailer
const transporter = nodemailer.createTransport({
  service: 'hotmail', // ou outro serviço de email
  auth: {
    user: "contato.etnobook@hotmail.com",
    pass: "plantassalvamvidas"
  }
});

// Rotas para a página de login
app.get("/", (req, res) => {
  res.render("login.html");
});

app.get("/login.html", (req, res) => {
  res.render("login.html");
});

// Rota de login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(400)
      .json({ erro: "Você precisa preencher todos os campos." });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM agente WHERE email = ? AND senha = ?",
      [email, senha]
    );

    if (rows.length > 0) {
      req.session.user = rows[0];
      res.redirect("/views/home");
    } else {
      res.status(401).json({ error: "Credenciais inválidas!" });
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});









// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });