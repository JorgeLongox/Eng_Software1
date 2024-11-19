const { OAuth2Client } = require("google-auth-library");
const db = require("../configs/config");
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

exports.googleLogin = async (req, res) => {
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
      return res.json({ success: false, email, name });
    }
  } catch (error) {
    console.error("Erro durante a autenticação do Google:", error);
    res.status(500).json({ error: "Erro ao validar o token do Google" });
  }
};