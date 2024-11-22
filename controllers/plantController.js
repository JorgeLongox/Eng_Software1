const db = require("../configs/config");
const logger = require("../logger/logger");

exports.renderHome = async (req, res) => {
  try {
    const [plant] = await db.query("SELECT * FROM plantas");
    logger.info("Plantas encontradas. Renderizando a página home com a lista delas.");
    res.render("home.html", { plant });
  } catch (error) {
    logger.error(`Erro ao buscar plantas: ${error.message}`);
    res.status(500).json({ error: "Erro ao buscar plantas" });
  }
};

exports.getPlant = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM plantas");
    logger.info("Plantas encontradas. Renderizando a página home com a lista delas.");
    res.status(200).json(rows);
  } catch (error) {
    logger.error(`Erro ao buscar plantas: ${error.message}`);
    res.status(500).json({ error: "Erro ao buscar plantas" });
  }
};