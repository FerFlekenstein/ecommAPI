import cartModel from "./models/carritoModel.js";
import prodModel from "./models/prodModel.js";
import { logger } from "../../middlewares/logger.js";
class CarritoDao {

    async createCart(email) {
        try {
            const cart = { email: email, productos: [] }
            await cartModel.create(cart);
            return await cartModel.find(cart)._id
        } catch (error) {
            logger.warn(`error en createCart: ${error}`)
            return error
        }
    }
    async getCart(email) {
        try {
            const cart = await cartModel.findOne({usuario: email})
            return cart
        } catch (error) {
            logger.warn(`error en getCart: ${error}`)
            return false
        }
    }
    async saveProduct(idCart, idProduct) {
        try {
            const cart = await cartModel.findById({ _id: idCart });
            const prod = await prodModel.findById({ _id: idProduct });
            const hayItem = cart.productos.some((item) => item._id === prod._id);
            if(!hayItem) return {message: `Ya existe este producto en el carrito`}
            cart.productos.push(prod);
            await cart.save()
        } catch (error) {
            logger.warn(`error en saveProduct: ${error}`)
        }
    }
    async updateCart(id, data) {
        const cart = await cartModel.findByIdAndUpdate({_id: id}, {productos: data})
        return cart
    }
    async delProdById(idCart, idProduct) {
        try {
            const cart = await cartModel.findById({ _id: idCart });
            const prod = await prodModel.findById({ _id: idProduct });
            const hayItem = cart.productos.some((item) => item._id === prod._id);
            if (hayItem) {
                const indice = cart.productos.indexOf(prod);
                cart.productos.splice(indice, 1);
                await cart.save()
                return {message: `${prod.title} borrado`}
            } else {
                return {message: "No existe ese producto en el carrito"}
            }
        } catch (error) {
            logger.warn(`error en delProdById: ${error}`)
        }
    }
}
export default CarritoDao;