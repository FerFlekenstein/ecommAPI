import ProductosM from "../dao/mongo/productos.js";
const productos = new ProductosM();
const getAll = async (req, res, next) => {
    const totalProductos = await productos.getAll()
    res.send(JSON.stringify(totalProductos));
}
const getId = async (req, res, next) => {
    const { id } = req.params;
    const resultado = await productos.getById(id);
    res.send(JSON.stringify(resultado));
}
const getByCategory = async (req, res) => {
    const {categoryId} = req.params;
    const category = categoryId.toLowerCase()
    const resultado = await productos.getByCategory(category)
    res.send(JSON.stringify(resultado));
}
const postProd = async (req, res, next) => {
    const file = req.file
    const category = req.body.category.toLowerCase()
    const nuevoProd = {
        title: req.body.title,
        category: category,
        stock: req.body.stock,
        price: req.body.price,
        thumbnail : `https://${req.hostname}/img/${file.filename}`
    }
    const prodBD = await productos.save(nuevoProd);
    res.send(JSON.stringify(prodBD._id));
}
const putProd = async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
    const infoUpdate = { id, stock };
    await productos.updateStock(infoUpdate);
    res.send(`El producto ${id} fue actualizado`);
}
const admin = async(req, res) => {
    const totalProductos = await productos.getAll()
    res.send(totalProductos)
}
const deleteProd = async (req, res, next) => {
    const { id } = req.params;
    const respuesta = await productos.deleteById(id);
    respuesta ? res.send(`El producto con id: ${id} fue eliminado`) : res.json({ error: "producto no encontrado" });
}
export default {
    getAll,
    getId,
    getByCategory,
    postProd,
    putProd,
    deleteProd,
    admin
}