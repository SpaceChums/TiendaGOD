import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = Router();

// GET para pruebas
router.get("/register", (req, res) => {
  res.json({ 
    message: "Auth route is working! Use POST to register",
    method: "GET" 
  });
});

// POST para registro
router.post("/register", async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    // Validaciones
    if (!usuario || !contrasena) {
      return res.status(400).json({ 
        success: false,
        message: "Usuario y contraseña son requeridos" 
      });
    }

    if (contrasena.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres" 
      });
    }

    // Verificar si el usuario ya existe
    const [existingUser] = await pool.query(
      'SELECT IdLogin FROM login WHERE usuario = ?',
      [usuario]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ 
        success: false,
        message: "El usuario ya está registrado" 
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar usuario
    const [result] = await pool.query(
      'INSERT INTO login (usuario, contrasena) VALUES (?, ?)',
      [usuario, hashedPassword]
    );

    // Generar token JWT
    const token = jwt.sign(
      { id: result.insertId, usuario },
      process.env.JWT_SECRET || 'tu_secreto_temporal',
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        id: result.insertId,
        usuario,
        token
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: "Error del servidor: " + error.message 
    });
  }
});

// POST para login
router.post("/login", async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({ 
        success: false,
        message: "Usuario y contraseña son requeridos" 
      });
    }

    // Buscar usuario
    const [users] = await pool.query(
      'SELECT * FROM login WHERE usuario = ?',
      [usuario]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: "Credenciales inválidas" 
      });
    }

    const user = users[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(contrasena, user.contrasena);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: "Credenciales inválidas" 
      });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.IdLogin, usuario: user.usuario },
      process.env.JWT_SECRET || 'tu_secreto_temporal',
      { expiresIn: '7d' }
    );

    res.json({ 
      success: true,
      message: "Login exitoso",
      data: {
        id: user.IdLogin,
        usuario: user.usuario,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: "Error del servidor: " + error.message 
    });
  }
});

export default router;