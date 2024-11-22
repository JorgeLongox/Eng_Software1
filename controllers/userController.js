const db = require("../configs/config");
const transporter = require("../configs/nodemailer");

exports.renderCadastro = (req, res) => {
  res.render("cadastro.html");
};

exports.cadastro = async (req, res) => {
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
};

exports.renderEsqSenha = (req, res) => {
  res.render("esq_senha.html");
};

exports.esqueceuSenha = async (req, res) => {
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
        subject: "RECUPERAÇÃO DE SENHA",
        text: `Ola querido amante da natureza! Aqui está sua senha: ${senha}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Erro ao enviar email:", error);
          return res.status(500).json({ error: "Erro ao enviar email" });
        } else {
          console.log("Email enviado: " + info.response);
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
};