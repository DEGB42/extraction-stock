export function validateCreateProduct(body: unknown): string | null {
  const stockUnits = ["BOX", "BAG", "BOTTLE", "UNIT"];
  const packageUnits = ["KG", "G", "L", "ML", "UNIT"];

  if (typeof body !== "object" || body === null) {
    return "Invalid request body.";
  }

  // Treat body as an object with unknown values
  const data = body as Record<string, unknown>;

  const hasPackageQuantity =
    data.package_quantity !== undefined && data.package_quantity !== null;

  const hasPackageUnit =
    data.package_unit !== undefined && data.package_unit !== null;

  if (typeof data.name !== "string" || data.name.trim().length === 0) {
    return "Name must be a non-empty string.";
  }

  if (
    typeof data.category_id !== "number" ||
    !Number.isInteger(data.category_id) ||
    data.category_id <= 0
  ) {
    return "category_id must be a positive integer.";
  }

  if (
    data.stock !== undefined &&
    (typeof data.stock !== "number" ||
      !Number.isInteger(data.stock) ||
      data.stock < 0)
  ) {
    return "Stock must be a non-negative integer.";
  }

  if (
    typeof data.stock_unit !== "string" ||
    !stockUnits.includes(data.stock_unit)
  ) {
    return "Invalid stock unit.";
  }

  if (hasPackageQuantity !== hasPackageUnit) {
    return "package_quantity and package_unit must be provided together.";
  }

  if (
    hasPackageQuantity &&
    (typeof data.package_quantity !== "number" || data.package_quantity <= 0)
  ) {
    return "package_quantity must be a positive number.";
  }

  if (
    hasPackageUnit &&
    (typeof data.package_unit !== "string" ||
      !packageUnits.includes(data.package_unit))
  ) {
    return "Invalid package unit.";
  }

  return null;
}
