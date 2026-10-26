import { Router } from "express";
import {
  createProduct,
  getOutOfStockProducts,
  getProductById,
  getProductMovements,
  getProducts,
  updateProductStock,
} from "../controllers/products.controller";

const router = Router();

router.get("/out-of-stock", getOutOfStockProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:id/movements", getProductMovements);
router.post("/", createProduct);
router.patch("/:id/stock", updateProductStock);

export default router;
