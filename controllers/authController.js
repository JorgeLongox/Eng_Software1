const db = require("../configs/config");
const crypto = require("crypto");
const transporter = require("../configs/nodemailer");
const logger = require("../logger/logger");

exports.renderHomepage = (req, res) => {
  logger.info("Página de homepage renderizada.");
  res.render("homepage.html");
};

exports.renderLogin = (req, res) => {
  logger.info("Página de login renderizada.");
  res.render("login.html");
};

exports.renderConta = (req, res) => {
  if (req.session.user) {
    logger.info("Página de conta renderizada.");
    res.render("conta.html", { usuario: req.session.user });
  } else {
    logger.warn("Como o usário não está logado, a página de login foi renderizada.");
    res.redirect("/views/login.html");
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    logger.error("Campos em branco no momento de fazer login.");
    return res.status(400).json({ erro: "Você precisa preencher todos os campos." });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuario WHERE email = ? AND senha = ?",
      [email, senha]
    );

    if (rows.length > 0) {
      req.session.user = rows[0];
      logger.info("Login realizado com sucesso.");
      res.status(200).json({ success: true, message: "Login bem-sucedido" });
    } else {
      logger.error("Credenciais inválidas, por isso o login não pôde ser completado.");
      res.status(401).json({ error: "Credenciais inválidas!" });
    }
  } catch (error) {
    logger.error(`Erro ao fazer login: ${error.message}`);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error(`Error ao fazer logout: ${err.message}`);
      return res.status(500).json({ error: "Erro ao fazer logout" });
    }
    logger.info("Logout realizado com sucesso, assim a página de login será renderizada.");
    res.redirect("/views/login.html");
  });
};

exports.solicitarRedefinicaoSenha = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    logger.error("Tentatiza de solicitação de redefinição de senha com campo de email não preenchido.");
    return res.status(400).json({ error: "O campo de email é obrigatório." });
  }

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);
    if (rows.length === 0) {
      logger.error(`O email ${email} não foi encontrado, por isso a tentativa de redefinição de senha não pode ser concluída.`);
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
        logger.error(`Erro ao enviar email: ${error.message}`);
        return res.status(500).json({ error: "Erro ao enviar email." });
      } else {
        logger.info(`Email de redefinição de senha enviado com sucesso para ${email}.`);
        res.status(200).json({ message: "Email de redefinição enviado com sucesso." });
      }
    });
  } catch (error) {
    logger.error(`Erro interno do servidor: ${error.message}`);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

exports.redefinirSenha = async (req, res) => {
  const { token } = req.params;
  const { novaSenha } = req.body;

  if (!novaSenha) {
    logger.error("A nova senha não foi enviada e é obrigatório o seu recebimento.");
    return res.status(400).json({ error: "A nova senha é obrigatória." });
  }

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE reset_token = ? AND reset_token_expiration > ?", [token, Date.now()]);
    if (rows.length === 0) {
      logger.error("Não é possível redefinir a senha com um token inávlido ou expirado.");
      return res.status(400).json({ error: "Token inválido ou expirado." });
    }

    const hashedSenha = novaSenha; // Você pode aplicar hashing aqui, por exemplo, com bcrypt

    await db.query("UPDATE usuario SET senha = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?", [hashedSenha, rows[0].id]);
    logger.info("Senha redefinida com sucesso.");
    res.status(200).json({ message: "Senha redefinida com sucesso." });
  } catch (error) {
    logger.error(`Erro ao redefinir a senha: ${error.message}`);
    res.status(500).json({ error: "Erro ao redefinir a senha." });
  }
};