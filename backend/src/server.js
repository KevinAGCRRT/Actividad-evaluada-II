
import express from "express";
import cors from "cors";
import reactorRouter from "./Reactor/routes.js";
import astroRouter from "./astrologistics/routes.js";
import { rutaNoEncontrada, manejadorErrores } from "./middlewares.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json()); 

app.use("/", reactorRouter);
app.use("/api", astroRouter); 


app.use(rutaNoEncontrada);
app.use(manejadorErrores);

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
  console.log(`  Reactor:        POST /adjust, POST /reboot`);
  console.log(`  AstroLogistics: /api/inventario, /api/carga ...`);
});
