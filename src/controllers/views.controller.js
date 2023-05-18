import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { logger } from '../middlewares/logger.js';
import ProductosM from '../dao/mongo/productos.js';
const productos = new ProductosM(); 
const login = (req, res) => {
    const token = req.cookies[config.jwt.cookie]
    if(token){
        res.redirect(307, '/productos')
    } else {
        res.render('login');
    }
}
const register = (req, res) => {
    res.render('register');
}
const renderProducts = async (req, res) => {
    const arrProd = await productos.getAll();
    const token = req.cookies[config.jwt.cookie];
    try {
        const user = jwt.verify(token, config.jwt.token)
        res.render("productos", { objetos: arrProd, user: user})
    } catch (error) {
        logger.warn(`Ocurrio un error al verificar el token. ${error}`)
    }
}
export default {
    login,
    register,
    renderProducts
}