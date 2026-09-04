import type { Request, Response } from "express";
import {
  getAllProducts,
  getProductById as getProductByIdService,
  searchProducts,
} from "../services/products.service.js";

export async function getProducts(req: Request, res: Response) {
  try {
    const search = req.query.search;

    if (typeof search == "string") {
      const products = await searchProducts(search);
      return res.json(products);
    }

    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get products",
    });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({
        error: "Id is NaN",
      });
      return;
    }

    const product = await getProductByIdService(id);
    if (!product) {
      res.status(404).json({
        error: "Product not found",
      });

      return;
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get product",
    });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const {
      name,
      category_id,
      stock,
      stock_unit,
      package_quantity,
      package_unit,
    } = req.body;

    if (
      name == undefined ||
      category_id == undefined ||
      stock_unit ||
      undefined
    ) {
      res.status(400).json({
        error: "Missing required fields",
      });
      return;
    }
  } catch (error) {}
}
