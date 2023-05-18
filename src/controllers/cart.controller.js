import jwt from "jsonwebtoken";
import config from "../config/config.js";
import CarritoM from "../dao/mongo/carrito.js";
import ProductosM from "../dao/mongo/productos.js";
import { transporter } from "../mods/mailing.js";
const prodBD = new ProductosM();
const carrito = new CarritoM();
const createCart = async(req, res) => {
    const body = JSON.stringify(req.body)
    const { email } = JSON.parse(body)
    const cartExist = await carrito.getCart(email)
    const response = !cartExist? await carrito.createCart(email) : cartExist
    res.send(JSON.stringify(response));
}
const findCart = async(req, res, next) => {
    const body = JSON.stringify(req.body)
    const email = JSON.parse(body)
    const cartExist = await carrito.getCart(email)
    res.send(JSON.stringify(cartExist))
}
const deleteCartContent = async(req, res) => {
    const { id } = req.params;
    const _id = id
    const cart = await carrito.getCart(_id)
    cart.productos = []
    await cart.save()
    res.send("Carrito eliminado");
}
const addProdToCart = async(req, res) => {
    const { id } = req.params;
    const { idProduct } = req.body;
    await carrito.saveProduct(id, idProduct);
    res.send("Producto agregado")
}
const deleteProd = async (req, res, next) => {
    const { id } = req.params;
    const { id_prod } = req.params;
    const response = await carrito.delProdById(id, id_prod);
    res.send(response.message)
}
const sendEmail = async(req, res, next) => {
    const body = JSON.stringify(req.body)
    const bodyParsed = JSON.parse(body)
    const token = req.cookies[config.jwt.cookie]
    const {nombre, email} = jwt.verify(token, config.jwt.token)
    const cart = await carrito.getCart(email)
    cart.productos = [...bodyParsed]
    //Escribir el mail
    let contenedor = `<h4></h4>`;
    for (const producto of bodyParsed) {
        const prod = await prodBD.getById(producto.id)
        if (prod) {
            contenedor += `<p style="color:blue;"><span>Titulo:${prod.title}</span> <span>$${prod.price}</span> <span>Cantidad:${producto.cantidad}</span> <span>${prod.thumbnail}</span></p>`
        }
    }
    await transporter.sendMail({
        from:`Entrega Final 3 ahora si que si <${config.app.GMAIL_USER}>`,
        to:email,
        subject:`Nuevo pedido de ${nombre} (${email})`,
        html:`<div>${contenedor}</div>`
    })
    res.send({status: "success", message: "Compra finalizada"})
}
export default {
    createCart,
    findCart,
    sendEmail,
    deleteCartContent,
    addProdToCart,
    deleteProd
}