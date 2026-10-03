import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProductStock,
} from "../controllers/products.controller";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.patch("/:id/stock", updateProductStock);

export default router;
