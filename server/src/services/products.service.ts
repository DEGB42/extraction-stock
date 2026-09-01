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

export async function getProductById(id: number) {
const result = await pool.query(`
    SELECT
        products.id,
        products.name,
        categories.name AS category,
        products.stock,
        products.stock_unit
    FROM products
    JOIN categories
        ON categories.id = products.category_id
    WHERE products.id = $1;
`, [id]);

    return result.rows[0];
}

export async function searchProducts(search: string) {
    const pattern = `%${search}%`;

    const result = await pool.query(`
        SELECT
            products.id,
            products.name,
            categories.name AS category,
            products.stock,
            products.stock_unit
        FROM products
        JOIN categories
            ON categories.id = products.category_id
        WHERE products.name ILIKE $1;
    `, [pattern]);

    return result.rows;
}