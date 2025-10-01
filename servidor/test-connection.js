const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mysql = require("mysql2/promise");

// Validar variables requeridas
const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_NAME"];
for (const k of required) {
  if (!process.env[k] && process.env[k] !== "") {
    throw new Error(`Falta la variable ${k} en .env`);
  }
}

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,      // ej. root
      password: process.env.DB_PASS,  // puede ser vacío ""
      database: process.env.DB_NAME,  // ej. tienda_db
    });

    const [rows] = await conn.query("SELECT 1 AS ok");
    console.log("Conexión MySQL exitosa ✅", rows[0]); // { ok: 1 }
    await conn.end();
    process.exit(0);
  } catch (e) {
    console.error("Error de conexión ❌", e.message);
    process.exit(1);
  }
})();
