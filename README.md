# Extraction Stock

A coffee shop inventory management application designed to track product stock and simplify the ordering process.

Extraction Stock aims to provide a centralized way to manage inventory, find products quickly, track stock levels and stock movements, and eventually simplify the process of preparing and managing supplier orders.

## Features

Currently implemented:

- List all products
- Get a product by ID
- Search products by name
- Create products
- Product input validation
- Product categories
- Current stock tracking
- Manual stock updates
- Stock movement history
- Transactional stock updates
- PostgreSQL database integration
- REST API built with Express and TypeScript

## Tech Stack

### Backend

- Node.js
- TypeScript
- Express
- PostgreSQL
- `pg` (node-postgres)

### Development

- tsx
- dotenv
- Git

## Project Structure

```text
server/
└── src/
    ├── controllers/
    │   └── products.controller.ts
    ├── routes/
    │   └── products.routes.ts
    ├── services/
    │   └── products.service.ts
    ├── types/
    │   └── products.types.ts
    ├── validators/
    │   └── products.validator.ts
    ├── db.ts
    └── index.ts
```

The backend follows a simple layered architecture:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Validation
   ↓
Service
   ↓
PostgreSQL
```

- Routes define API endpoints and direct requests to the appropriate controller.
- Controllers handle HTTP requests, responses, validation flow, and HTTP errors.
- Validators check incoming request data before it reaches the database layer.
- Services contain application and data-access logic and communicate with PostgreSQL.
- `db.ts` configures the PostgreSQL connection pool.

## API

### Get all products

```http
GET /products
```

Returns all products currently stored in the database.

---

### Get product by ID

```http
GET /products/:id
```

Example:

```http
GET /products/1
```

Possible responses:

- `200` — Product found
- `400` — Invalid product ID
- `404` — Product not found
- `500` — Internal server error

---

### Search products

```http
GET /products?search=<name>
```

Example:

```http
GET /products?search=vanilla
```

Product search is case-insensitive and supports partial names.

For example:

```text
?search=vani
```

can match:

```text
Vanilla
```

---

### Create a product

```http
POST /products
```

Example request body:

```json
{
  "name": "Matcha",
  "category_id": 5,
  "stock": 2,
  "stock_unit": "BAG",
  "package_quantity": 1,
  "package_unit": "KG"
}
```

Example response:

```json
{
  "id": 1,
  "name": "Matcha",
  "category_id": 5,
  "stock": 2,
  "stock_unit": "BAG",
  "package_quantity": 1,
  "package_unit": "KG",
  "created_at": "2026-09-24T10:00:00.000Z",
  "updated_at": "2026-09-24T10:00:00.000Z"
}
```

Product data is validated before being inserted into the database.

Validation includes:

- Product name must be a non-empty string
- Category ID must be a positive integer
- Stock must be a non-negative integer
- Stock unit must be valid
- Package quantity must be a positive number when provided
- Package unit must be valid
- Package quantity and package unit must be provided together
- Category must exist

---

### Update product stock

```http
PATCH /products/:id/stock
```

Example:

```http
PATCH /products/1/stock
Content-Type: application/json
```

Request body:

```json
{
  "stock": 5
}
```

The endpoint sets the product's current stock to the provided value.

The operation is performed inside a PostgreSQL transaction:

```text
BEGIN
  ↓
SELECT current stock
FOR UPDATE
  ↓
Calculate stock change
  ↓
UPDATE product
  ↓
INSERT stock movement
  ↓
COMMIT
```

The selected product row is locked with `FOR UPDATE` while the transaction is running. This prevents concurrent stock updates from producing inconsistent stock movement history.

If any operation fails, the transaction is rolled back.

Each successful manual stock update creates an `ADJUSTMENT` entry in `stock_movements` containing:

- Previous stock
- New stock
- Quantity change
- Product ID
- Movement type
- Creation timestamp

Possible responses:

- `200` — Stock updated successfully
- `400` — Invalid product ID or stock value
- `404` — Product not found
- `500` — Internal server error

## Database

The application currently uses the following main entities:

```text
CATEGORY
    │
    └── PRODUCT
           │
           ├── ORDER_ITEM ── ORDER
           │
           └── STOCK_MOVEMENT
```

The database is designed to support:

- Product categories
- Current stock levels
- Product packaging units
- Orders and order items
- Received quantities
- Stock movement history

Stock movements provide an audit trail of inventory changes.

For manual adjustments, a movement stores:

```text
previous_stock
      ↓
quantity_change
      ↓
new_stock
```

The database uses PostgreSQL constraints to help maintain data integrity.

## Environment Variables

Database credentials are stored using environment variables.

Create a `.env` file inside the `server` directory:

```env
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
DB_NAME=extraction_stock
```

The `.env` file must not be committed to the repository.

## Running the Backend

Install dependencies:

```bash
cd server
npm install
```

Start the development server:

```bash
npm run dev
```

The API runs by default on:

```text
http://localhost:3000
```

## Roadmap

### Completed

- List products
- Get product by ID
- Search products by name
- Create products
- Product input validation
- Update current stock
- Record manual stock movements
- Transactional stock updates
- Row locking for concurrent stock updates

### Next

- Expose stock movement history through the API
- Show out-of-stock products
- Browse products by category
- Edit product information
- Create and manage orders
- Receive orders
- Automatically update stock when orders are received
- Order history
- Automatic order message generation
- Desktop interface

## Project Status

Extraction Stock is currently under active development.

The project is being built incrementally, with an initial focus on the backend API, database design, inventory integrity, and stock management before developing the frontend.

The current development phase focuses on completing the inventory system and exposing stock movement history before moving on to order management.
