import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
const router = new Router();
router.get("/", cartController.findCart);
router.post("/finish", cartController.sendEmail);
router.post("/:id/productos", cartController.addProdToCart);
router.delete("/:id/productos/:id_prod", cartController.deleteProd);
export default router;