const db = require("../configs/config");

exports.renderHome = async (req, res) => {
  try {
    const [plant] = await db.query("SELECT * FROM plantas");
    res.render("home.html", { plant });
  } catch (error) {
    console.error("Erro ao buscar plantas:", error);
    res.status(500).json({ error: "Erro ao buscar plantas" });
  }
};

exports.getPlant = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM plantas");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar plantas:", error);
    res.status(500).json({ error: "Erro ao buscar plantas" });
  }
};