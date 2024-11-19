const db = require("../configs/config");
const crypto = require("crypto");
const transporter = require("../configs/nodemailer");

exports.renderHomepage = (req, res) => {
  res.render("homepage.html");
};

exports.renderLogin = (req, res) => {
  res.render("login.html");
};

exports.renderConta = (req, res) => {
  if (req.session.user) {
    res.render("conta.html", { usuario: req.session.user });
  } else {
    res.redirect("/views/login.html");
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Você precisa preencher todos os campos." });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuario WHERE email = ? AND senha = ?",
      [email, senha]
    );

    if (rows.length > 0) {
      req.session.user = rows[0];
      res.json({ success: true, message: "Login bem-sucedido" });
    } else {
      res.status(401).json({ error: "Credenciais inválidas!" });
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao fazer logout" });
    }
    res.redirect("/views/login.html");
  });
};

exports.solicitarRedefinicaoSenha = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "O campo de email é obrigatório." });
  }

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Email não encontrado." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = Date.now() + 3600000; // 1 hora

    await db.query("UPDATE usuario SET reset_token = ?, reset_token_expiration = ? WHERE email = ?", [token, tokenExpiration, email]);

    const resetLink = `http://localhost:9000/redefinir-senha/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Redefinição de Senha",
      text: `Olá! Clique no link a seguir para redefinir sua senha: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erro ao enviar email:", error);
        return res.status(500).json({ error: "Erro ao enviar email." });
      } else {
        res.json({ message: "Email de redefinição enviado com sucesso." });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
exports.redefinirSenha = async (req, res) => {
  const { token } = req.params;
  const { novaSenha } = req.body;

  if (!novaSenha) {
    return res.status(400).json({ error: "A nova senha é obrigatória." });
  }

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE reset_token = ? AND reset_token_expiration > ?", [token, Date.now()]);
    if (rows.length === 0) {
      return res.status(400).json({ error: "Token inválido ou expirado." });
    }

    const hashedSenha = novaSenha; // Você pode aplicar hashing aqui, por exemplo, com bcrypt

    await db.query("UPDATE usuario SET senha = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?", [hashedSenha, rows[0].id]);
    res.json({ message: "Senha redefinida com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao redefinir a senha." });
  }
};
