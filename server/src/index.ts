import express, { type Express, type Request, type Response } from "express";
import { pool } from "./db.js";
import productsRouter from "./routes/products.routes.js";

const app: Express = express();
const port = 3000;

app.use("/products", productsRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
