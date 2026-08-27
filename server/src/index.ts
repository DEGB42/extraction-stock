import express, { type Express, type Request, type Response } from 'express';
import { pool } from './db.js';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
res.send('Hello World!');
});

app.get('/products', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT
                products.id,
                products.name,
                categories.name AS category,
                products.stock,
                products.stock_unit
            FROM products
            JOIN categories
                ON categories.id = products.category_id;
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Failed to get products'
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})