import jwt from "jsonwebtoken";
import config from "../config/config.js";
import CarritoM from "../dao/mongo/carrito.js";
import ProductosM from "../dao/mongo/productos.js";
import { transporter } from "../mods/mailing.js";
const prodBD = new ProductosM();
const carrito = new CarritoM();
const findCart = async(req, res, next) => {
    const body = JSON.stringify(req.body)
    const email = JSON.parse(body)
    const cartExist = await carrito.getCart(email)
    res.send(JSON.stringify(cartExist))
}
const addProdToCart = async(req, res) => {
    const { id } = req.params;
    const { idProduct } = req.body;
    await carrito.saveProduct(id, idProduct);
    res.send("Producto agregado")
}
const deleteProd = async (req, res) => {
    const { id } = req.params;
    const { id_prod } = req.params;
    const response = await carrito.delProdById(id, id_prod);
    res.send(response.message)
}
const sendEmail = async(req, res) => {
    const token = req.cookies[config.jwt.cookie]
    const {email, nombre} = jwt.verify(token, config.jwt.token)
    const cart = await carrito.getCart(email)
    cart.productos = [...req.body]
    let contenedor = `<h4></h4>`;
    for (const producto of cart.productos) {
        const prod = await prodBD.getById(producto._id)
        if (prod) {
            contenedor += `<p style="color:blue;"><span>Titulo: ${prod.title}</span> <span>$${prod.price}</span> <span>Cantidad: ${producto.cantidad}</span> <span>${prod.thumbnail}</span></p>`
        }
    }
    await transporter.sendMail({
        from:`EvilCompragamer<${config.app.GMAIL_USER}>`,
        to:email,
        subject:`Nuevo pedido de ${nombre} (${email})`,
        html:`<div>${contenedor}</div>`
    })
    res.send({status: "success", message: "Compra finalizada"})
}
export default {
    findCart,
    sendEmail,
    addProdToCart,
    deleteProd
}