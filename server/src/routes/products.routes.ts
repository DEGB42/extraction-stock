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

// ¿Qué ruta escribirías para representar /:id/movements?

// ¿Qué función del controller debes importar?

// ¿Qué método HTTP corresponde a consultar información sin modificarla?
