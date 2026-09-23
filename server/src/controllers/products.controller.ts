import type { Request, Response } from "express";
import {
  getAllProducts,
  getProductById as getProductByIdService,
  searchProducts,
  createProduct as createProductService,
} from "../services/products.service.js";
import { DatabaseError } from "pg";

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
    const stockValidations = ["BOX", "BAG", "BOTTLE", "UNIT"];
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
      stock_unit == undefined
    ) {
      res.status(400).json({
        error: "Missing required fields",
      });
      return;
    }

    if (!stockValidations.includes(stock_unit)) {
      res.status(400).json({
        error: "Invalid stock unit",
      });
      return;
    }

    if (
      stock !== undefined &&
      (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0)
    ) {
      res.status(400).json({
        error: "Stock must be a non-negative number.",
      });
      return;
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({
        error: "Name must be a non-empty string.",
      });
      return;
    }

    if (
      typeof category_id !== "number" ||
      !Number.isInteger(category_id) ||
      category_id <= 0
    ) {
      res.status(400).json({
        error: "category_id must be a positive integer.",
      });
      return;
    }

    const product = await createProductService({
      name,
      category_id,
      stock,
      stock_unit,
      package_quantity,
      package_unit,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    // Handle foreign key violation
    if (error instanceof DatabaseError && error.code === "23503") {
      res.status(400).json({
        error: "Category does not exist.",
      });
      return;
    }

    res.status(500).json({
      error: "Failed to create product",
    });
  }
}
