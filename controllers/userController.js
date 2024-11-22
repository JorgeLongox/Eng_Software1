const db = require("../configs/config");
const transporter = require("../configs/nodemailer");
const logger = require("../logger/logger");

exports.renderCadastro = (req, res) => {
  logger.info("Página de cadastro renderizada.");
  res.render("cadastro.html");
};

exports.cadastro = async (req, res) => {
  const { nome, email, senha, data_nascimento, genero, tipo_conta } = req.body;

  if (!nome || !email || !senha || !data_nascimento || !genero || !tipo_conta) {
    logger.error("Tentativa de cadastro com campos vazios.");
    return res.status(400).json({ error: "Você precisa preencher todos os campos!" });
  }

  try {
    const [rows] = await db.query(
      "INSERT INTO usuario (nome, email, senha, data_nascimento, genero, tipo_perfil) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, email, senha, data_nascimento, genero, tipo_conta]
    );
    logger.info(`Cadastro do usuário com nome ${nome} e email ${email} realizado com sucesso.`);
    res.redirect("/");
  } catch (error) {
    logger.error(`Erro ao cadastrar usuário: ${error.message}`);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
};

exports.renderEsqSenha = (req, res) => {
  logger.info("Página esq_senha.html renderizada.");
  res.render("esq_senha.html");
};

exports.esqueceuSenha = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    logger.error("Tentatiza de recuperação de senha com o campo de email não preenchido.");
    return res.status(400).json({ error: "Você precisa preencher o campo de email!" });
  }

  try {
    const [rows] = await db.query("SELECT senha FROM usuario WHERE email = ?", [email]);

    if (rows.length > 0) {
      const senha = rows[0].senha;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "RECUPERAÇÃO DE SENHA",
        text: `Ola querido amante da natureza! Aqui está sua senha: ${senha}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(`Erro ao enviar email: ${error.message}`);
          return res.status(500).json({ error: "Erro ao enviar email" });
        } else {
          logger.info(`Email de redefinição de senha enviado com sucesso para ${email}: ${info.response}`);
          res.redirect("/");
        }
      });
    } else {
      logger.error(`Email ${email} não encontrado.`);
      res.status(404).json({ error: "Email não encontrado!" });
    }
  } catch (error) {
    logger.error(`Erro ao recuperar senha: ${error.message}`);
    res.status(500).json({ error: "Erro ao recuperar senha" });
  }
};