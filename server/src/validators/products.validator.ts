function validateCreateProduct(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return "Invalid request body.";
  }

  // validate body as Object
  const data = body as Record<string, unknown>;

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

  return null;
}
