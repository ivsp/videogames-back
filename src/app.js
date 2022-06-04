import {} from "dotenv/config";
import express from "express";
import cors from "cors";
import videogamesRouter from "./videogames/videogames.router.js";
import authRouter from "./auth/auth.router.js";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: "utf-8" }));

app.use("/auth", authRouter); // declaramos el router de autenticación
app.use("/api", videogamesRouter);
app.use("/static", express.static("public-static"));

//creamos dos endpoint:
// 1. para leer los juegos del servidor
// 2. para crear nuevos juegos, aqui le ponemos el middleware de autenticacion

app.listen(port, () => console.log(`Server listening on port ${port}`));
