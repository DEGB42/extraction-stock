import { pool } from "../db.js";

interface CreateProductInput {
  name: string;
  category_id: number;
  stock?: number;
  stock_unit: "BOX" | "BAG" | "BOTTLE" | "UNIT";
  package_quantity?: number | null;
  package_unit?: "KG" | "G" | "L" | "ML" | "UNIT" | null;
}

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
