import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ message: "Token requerido" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, email }
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
