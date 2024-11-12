//Iniciando o Banco de Dados para nossa aplicação:
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: "bmjbxazkzdtote4wk6ga-mysql.services.clever-cloud.com",
  user: "uvf84urueh3lfvwe",
  password: "xcf21SfV5KY7oVYqpVbn",
  database: "bmjbxazkzdtote4wk6ga"
,
});

//Exportamos para que nosso arquivo backend.js consiga acessa-lo:
module.exports = pool.promise();