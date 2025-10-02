import bcrypt from "bcrypt";
import { pool } from "../db.js";
import { generateJwt } from "../Utils/generateJwt.js";

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ message: "email, password y name son requeridos" });

  try {
    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) return res.status(409).json({ message: "El email ya está registrado" });

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
      [email, password_hash, name]
    );

    const token = generateJwt({ id: result.insertId, email });
    res.status(201).json({ token, user: { id: result.insertId, email, name } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "email y password son requeridos" });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ message: "Credenciales inválidas" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = generateJwt({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
