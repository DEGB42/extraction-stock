import { pool } from '../db.js';

export async function getAllProducts() {
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

    return result.rows;
}