//Iniciando o Banco de Dados para nossa aplicação:
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "16140112",
  database: "etnobook",
});

//Exportamos para que nosso arquivo backend.js consiga acessa-lo:
module.exports = pool.promise();