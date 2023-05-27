import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UserDto from "../dao/DTO/userDTO.js";
import userService from "../dao/mongo/user.js";
import CarritoDao from "../dao/mongo/carrito.js";
import { createHash } from "../services/auth.js";
import { logger } from "../middlewares/logger.js";
const userDTO = new UserDto();
const cartDao = new CarritoDao()
const registro = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(500).send({ status: "error", error: "Error al guardar el archivo" })
    const { nombre, apellido, email, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).send({ status: "error", error: "Valores incompletos" });
    const userExists = await userService.getBy({ email });
    if (userExists) return res.status(400).send({ status: "error", error: "El usuario ya existe" });
    const hashedPassword = await createHash(password);
    const user = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: hashedPassword,
        avatar: `${req.protocol}://${req.hostname}:${process.env.PORT}/img/${file.filename}`,
        role: "PUBLIC"
    }
    await cartDao.createCart(email)
    await userService.save(user)
    res.send({ status: "success", message: "Registro hecho exitosamente."})
}
const createToken = async (req, res) => {
    try {
        const tokenReq = req.cookies[config.jwt.cookie]
        if (tokenReq) {
            jwt.verify(tokenReq, config.jwt.token);
        }else{
            const userToken = userDTO.getUserToken(req.user)
            const token = jwt.sign(userToken, config.jwt.token, {expiresIn:"1d"})
            res.cookie(config.jwt.cookie, token, {sameSite: "none", secure: true, httpOnly: true, domain: "https://proyecto-react-one.vercel.app/"})
        }
        res.send({status:"success", message: req.user})
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error del server" })
    }
}
const fail = (req, res) => {
    try {
        res.clearCookie(config.jwt.cookie)
        res.status(401).send({ status: 'error', message: "Ocurrió un error al ingresar los datos, por favor revise de estar ingresando bien su email y contraseña" });
    } catch (error) {
        res.send(error)
    }
}
const clearAndRedirect = (req, res) => {
    try {
        res.clearCookie(config.jwt.cookie)
        res.send({status: "success", message: "Vuelva prontos"})
    } catch (error) {
        logger.warn(`error en ${req.url} info del error: ${error}`)
    }
}
const isLogin = async (req, res) => {
    const tokenReq = req.cookies[config.jwt.cookie]
    if(tokenReq){
        const info = jwt.verify(tokenReq, config.jwt.token);
        res.send({status: "success", message: {role: info.role}})
    } else{
        res.send({status: "ok", message:"no hay cookie"})
    }
}
export default {
    registro,
    createToken,
    fail,
    clearAndRedirect,
    isLogin
}