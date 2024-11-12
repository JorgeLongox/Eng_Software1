const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./bd/config.js");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();  // Carrega as variáveis de ambiente do arquivo .env
const app = express();
const port = 9000;
const path = require("path");
const nodemailer = require("nodemailer");
const session = require("express-session");

// Utilizando as variáveis de ambiente
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID); // Google Client ID a partir do arquivo .env

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/public", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "/views"));

// Configuração de sessão com a chave secreta extraída das variáveis de ambiente
app.use(
  session({
    secret: 'process.env.SESSION_SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Configurando o Nodemailer com variáveis de ambiente
const transporter = nodemailer.createTransport({
  service: 'hotmail', 
  auth: {
    user: "process.env.EMAIL_USER",
    pass: "process.env.EMAIL_PASSWORD"
  }
});

// Rotas para a página de login
app.get("/", (req, res) => {
  res.render("homepage.html");
});

app.get("/views/contatos.html", (req, res) => {
  res.render("contatos.html");
});

app.get("/views/credit.html", (req, res) => {
  res.render("credit.html");
});

app.get("/views/login.html", (req, res) => {
  res.render("login.html");
});

app.get("/views/conta.html", (req, res) => {
  if (req.session.user) {
    res.render("conta.html", { usuario: req.session.user });
  } else {
    res.redirect("/views/login.html");
  }
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
      "SELECT * FROM usuario WHERE email = ? AND senha = ?",
      [email, senha]
    );

    if (rows.length > 0) {
      // Se o login for bem-sucedido, responda com um JSON
      req.session.user = rows[0];
      res.json({ success: true, message: "Login bem-sucedido" });
    } else {
      res.status(401).json({ error: "Credenciais inválidas!" });
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao fazer logout" });
    }
    res.redirect("/views/login.html");
  });
});

app.post("/google-login", async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
      return res.status(400).json({ error: "Token não fornecido" });
  }

  try {
      const ticket = await client.verifyIdToken({
          idToken: id_token,
          audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name } = payload;

      const [rows] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);

      if (rows.length > 0) {
          req.session.user = rows[0];
          return res.json({ success: true, message: "Login bem-sucedido" });
      } else {
          // Se o usuário não existir, envie os dados para a página de cadastro
          return res.json({ success: false, email, name });
      }
  } catch (error) {
      console.error("Erro durante a autenticação do Google:", error);
      res.status(500).json({ error: "Erro ao validar o token do Google" });
  }
});



app.get('/views/cadastro.html', async (req, res) => {
  res.render("cadastro.html");
});

app.post("/cadastro", async (req, res) => {
  const { nome, email, senha, data_nascimento, genero, tipo_conta } = req.body;

  if (!nome || !email || !senha || !data_nascimento || !genero || !tipo_conta) {
    return res.status(400).json({ error: "Você precisa preencher todos os campos!" });
  }

  try {
    const [rows] = await db.query(
      "INSERT INTO usuario (nome, email, senha, data_nascimento, genero, tipo_perfil) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, email, senha, data_nascimento, genero, tipo_conta]
    );
    res.redirect("/");
  } catch (error) {
    console.error("Erro ao cadastrar agente:", error);
    res.status(500).json({ error: "Erro ao cadastrar agente" });
  }
});

app.get("/views/esq_senha.html", (req, res) => {
  res.render("esq_senha.html");
});

app.post("/views/esq_senha", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Você precisa preencher o campo de email!" });
  }

  try {
    const [rows] = await db.query("SELECT senha FROM usuario WHERE email = ?", [email]);

    if (rows.length > 0) {
      const senha = rows[0].senha;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'RECUPERAÇÃO DE SENHA',
        text: `Ola querido amante da natureza! Aqui está sua senha: ${senha}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Erro ao enviar email:", error);
          return res.status(500).json({ error: "Erro ao enviar email" });
        } else {
          console.log('Email enviado: ' + info.response);
          res.redirect("/");
        }
      });
    } else {
      res.status(404).json({ error: "Email não encontrado!" });
    }
  } catch (error) {
    console.error("Erro ao recuperar senha:", error);
    res.status(500).json({ error: "Erro ao recuperar senha" });
  }
});

app.get('/views/home.html', async (req, res) => {
  try {
    const [plantas] = await db.query('SELECT * FROM plantas');
    res.render('home.html', { plantas });
  } catch (error) {
    console.error('Erro ao buscar plantas:', error);
    res.status(500).json({ error: 'Erro ao buscar plantas' });
  }
});

// Rota para obter todas as plantas
app.get("/api/plantas", async (req, res) => {
  try {
      const [rows] = await db.query("SELECT * FROM plantas");
      res.json(rows);
  } catch (error) {
      console.error("Erro ao buscar plantas:", error);
      res.status(500).json({ error: "Erro ao buscar plantas" });
  }
});




// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


