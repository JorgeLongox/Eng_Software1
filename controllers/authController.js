const db = require("../configs/config");

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