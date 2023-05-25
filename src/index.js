import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import __dirname from "./utils.js";
import config from "./config/config.js";
import apiCart from "./routes/cart.router.js";
import { logger } from "./middlewares/logger.js";
import apiProd from "./routes/product.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import initializeStrategy from "./config/passport.config.js";
const PORT = process.env.PORT;
const app = express();
try {
    const connection = mongoose.connect(config.mongo.URL);
} catch (error) {
    logger.error(`Falló la conexion a mongo. ${error}`)
}
//Middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials: true 
}));
initializeStrategy();
//Routes
app.use("/api/productos", apiProd);
app.use("/api/carrito", apiCart);
app.use("/api/sessions", sessionsRouter);
app.listen(PORT, () => { console.log(`Server on`) });