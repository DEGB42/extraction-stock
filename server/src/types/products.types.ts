export interface CreateProductInput {
  name: string;
  category_id: number;
  stock?: number;
  stock_unit: "BOX" | "BAG" | "BOTTLE" | "UNIT";
  package_quantity?: number | null;
  package_unit?: "KG" | "G" | "L" | "ML" | "UNIT" | null;
}
