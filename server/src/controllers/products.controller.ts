import type { Request, Response } from 'express';
import { getAllProducts, getProductById as getProductByIdService, searchProducts } from '../services/products.service.js';

export async function getProducts(req: Request, res: Response) {
    try {
        const search = req.query.search;

        if (typeof search == 'string') {
            const products = await searchProducts(search);
            res.json(products);
            return;
        }

        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Failed to get products'
        });
    }
}

export async function getProductById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({
                error: 'Id is NaN'
            });
            return;
        }

        const product = await getProductByIdService(id);
        if (!product) {
            res.status(404).json({
                error: 'Product not found'
            });

            return;
        }

        res.json(product);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Failed to get product'
        });
    }
}