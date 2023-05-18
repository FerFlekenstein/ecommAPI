import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UserDto from "../dao/DTO/userDTO.js";
import userService from "../dao/mongo/user.js";
import { transporter } from "../mods/mailing.js";
import { createHash } from "../services/auth.js";
import { logger } from "../middlewares/logger.js";
const userDTO = new UserDto();
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
        policies: "PUBLIC"
    }
    await userService.save(user)
    const result = await transporter.sendMail({
        from:`Entrega Final 3 - Fer <${config.app.GMAIL_USER}>`,
        to: config.app.GMAIL_ADMIN,
        subject:`Nuevo usuario`,
        html: `Se registró un nuevo usuario, aqui tienes algunos de sus datos (no lo doxees). Su nombre es: ${nombre} ${apellido}, y su email: ${email}`
    })
    res.send({ status: "success", message: "Registro hecho exitosamente."})
}
const createToken = async (req, res) => {
    try {
        console.log(req.user);
        const userToken = userDTO.getUserToken(req.user)
        const token = jwt.sign(userToken, config.jwt.token, { expiresIn: "1d" })
        res.cookie(config.jwt.cookie, token, {maxAge: 86400000}).send({status:"success", message:"LOGGEADOOOO"})
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error del server" })
    }
}
const fail = (req, res) => {
    // res.clearCookie(config.jwt.cookie)
    res.send({message: "Ocurrió un error al ingresar los datos, vuelve a intentarlo"})
}
const clearAndRedirect = (req, res) => {
    try {
        res.clearCookie(config.jwt.cookie)
        res.redirect('/')
    } catch (error) {
        logger.warn(`error en ${req.url} info del error: ${error}`)
    }
}
export default {
    registro,
    createToken,
    fail,
    clearAndRedirect,
}