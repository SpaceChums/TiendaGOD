import { pool } from "../db.js";

export const me = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, email, name, created_at FROM users WHERE id = ?",
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json(rows[0]);
};
