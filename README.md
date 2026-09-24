# Extraction Stock

A coffee shop inventory management application designed to track product stock and simplify the ordering process.

Extraction Stock aims to provide a centralized way to manage inventory, find products quickly, track stock levels, and eventually simplify the process of preparing and managing supplier orders.

## Features

Currently implemented:

- List all products
- Get a product by ID
- Search products by name
- Product categories
- Product stock tracking
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

The backend follows a simple layered architecture:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
PostgreSQL
```

- **Routes** define the API endpoints and direct requests to the appropriate controller.
- **Controllers** handle HTTP requests, validation, responses, and HTTP errors.
- **Services** contain data-access logic and communicate with PostgreSQL.
- **db.ts** configures the PostgreSQL connection pool.

## API

### Get all products

```http
GET /products
```

Returns all products currently stored in the database.

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

### Create a product

```http
POST /products

Example request body:

{
  "name": "Matcha",
  "category_id": 5,
  "stock": 2,
  "stock_unit": "BAG",
  "package_quantity": 1,
  "package_unit": "KG"
}

Example Response:

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

The endpoint validates product data before inserting it into the database.
Validation includes:
- Product name must be a non-empty string
- Category ID must be a positive integer
- Stock must be a non-negative integer
- Stock unit must be valid
- Package quantity must be a positive number when provided
- Package unit must be valid
- Package quantity and package unit must be provided together
- Category must exist

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

PostgreSQL constraints are used to help maintain data integrity.

## Environment Variables

Database credentials are stored using environment variables.

Create a `.env` file inside the server directory:

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

### Next

- Edit products
- Update stock
- Track stock movements
- Show out-of-stock products
- Browse products by category
- Create and manage orders
- Receive orders
- Order history
- Automatic order message generation
- Desktop interface

## Project Status

Extraction Stock is currently under active development.

The project is being built incrementally, with an initial focus on the backend API, database design, and inventory management logic before developing the frontend.
