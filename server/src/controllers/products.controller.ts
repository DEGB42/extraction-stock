import type { Request, Response } from 'express';
import { getAllProducts } from '../services/products.service.js';

export async function getProducts(req: Request, res: Response) {
    try {
        const products = await getAllProducts();

        res.json(products);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Failed to get products'
        });
    }
}