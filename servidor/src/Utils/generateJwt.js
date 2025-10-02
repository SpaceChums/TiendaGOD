import jwt from "jsonwebtoken";

export const generateJwt = (payload, expiresIn = process.env.JWT_EXPIRES || "7d") =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
