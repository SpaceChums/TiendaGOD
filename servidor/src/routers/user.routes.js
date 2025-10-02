import { Router } from "express";
import { me } from "../controllers/user.controller.js"; // Asegúrate de que esta ruta sea correcta
const router = Router();

// Ruta para obtener los datos del usuario
router.get("/me", me);

export default router;
