import cors from "cors";
import express from "express";
import authRoutes from "./routers/auth.routes.js"; // .js es necesario
import userRoutes from "./routers/user.routes.js"; // .js es necesario

const app = express();
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (_, res) => res.send("API OK"));

// Usar las rutas para autenticación y usuario
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Puerto de escucha
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});

export default app;
