import { Router } from "express";
import uploader from "../services/upload.js";
import { executePolicies } from "../middlewares/auth.js";
import productController from "../controllers/product.controller.js";
const router = new Router();
router.get("/", productController.getAll);
router.get("/category/:categoryId", productController.getByCategory);
router.get("/:id", productController.getId);
router.post("/",  uploader.single("thumbnail"), productController.postProd);
router.put("/:id", productController.putProd);
router.delete("/admin/:id", executePolicies("AUTHENTICATED"), productController.deleteProd);
router.get("/admin", executePolicies("AUTHENTICATED"), productController.admin)
router.post("/admin", executePolicies("AUTHENTICATED"), uploader.single("thumbnail"), productController.postProd)

export default router;