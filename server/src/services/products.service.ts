import { pool } from "../db.js";
import type { CreateProductInput } from "../types/products.types.js";

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
  const result = await pool.query(
    `
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
`,
    [id],
  );

  return result.rows[0];
}

export async function searchProducts(search: string) {
  const pattern = `%${search}%`;

  const result = await pool.query(
    `
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
    `,
    [pattern],
  );

  return result.rows;
}

export async function createProduct(product: CreateProductInput) {
  const {
    name,
    category_id,
    stock = 0,
    stock_unit: stockUnit,
    package_quantity: packageQuantity = null,
    package_unit: packageUnit = null,
  } = product;

  const result = await pool.query(
    `
        INSERT INTO products (
          name,
          category_id,
          stock,
          stock_unit,
          package_quantity,
          package_unit
        )
        VALUES
            ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `,
    [name, category_id, stock, stockUnit, packageQuantity, packageUnit],
  );

  return result.rows[0];
}

export async function updateProductStockService(id: number, newStock: number) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        SELECT stock
        FROM products
        WHERE id = $1
        FOR UPDATE;
      `,
      [id],
    );

    if (!result.rows[0]) {
      await client.query("ROLLBACK");
      return undefined;
    }

    const previousStock = result.rows[0].stock;
    const quantityChange = newStock - previousStock;

    const updatedProductResult = await client.query(
      `
    UPDATE products
    SET stock = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `,
      [newStock, id],
    );

    await client.query(
      `
    INSERT INTO stock_movements (
      product_id,
      order_id,
      type,
      quantity_change,
      previous_stock,
      new_stock
    )
    VALUES ($1, $2, $3, $4, $5, $6);
  `,
      [id, null, "ADJUSTMENT", quantityChange, previousStock, newStock],
    );

    await client.query("COMMIT");

    return updatedProductResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
