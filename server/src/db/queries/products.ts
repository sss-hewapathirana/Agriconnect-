import { db } from "../index.js";
import { products, productCategoryEnum } from "../schema/products.js";
import { eq, and, ilike, sql } from "drizzle-orm";

// ─── Types ────────────────────────────────────────────────────────────────────
export type NewProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;
export type ProductCategory = (typeof productCategoryEnum.enumValues)[number];

// ─── Create a product ─────────────────────────────────────────────────────────
export async function createProduct(data: NewProduct): Promise<Product> {
  const [product] = await db.insert(products).values(data).returning();
  return product;
}

// ─── Get all products for a specific farmer ───────────────────────────────────
export async function getFarmerProducts(farmerId: string): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(and(eq(products.farmerId, farmerId), eq(products.isAvailable, true)));
}

// ─── Get a single product by ID ───────────────────────────────────────────────
export async function getProductById(id: string): Promise<Product | undefined> {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id));
  return product;
}

// ─── Update a product ─────────────────────────────────────────────────────────
export async function updateProduct(
  id: string,
  farmerId: string,
  data: Partial<
    Pick<
      NewProduct,
      "name" | "category" | "description" | "pricePerUnit" | "unit" | "availableQuantity" | "isAvailable"
    >
  >
): Promise<Product> {
  const [updated] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(products.id, id), eq(products.farmerId, farmerId)))
    .returning();
  return updated;
}

// ─── Delete a product ─────────────────────────────────────────────────────────
export async function deleteProduct(
  id: string,
  farmerId: string
): Promise<void> {
  await db
    .delete(products)
    .where(and(eq(products.id, id), eq(products.farmerId, farmerId)));
}

// ─── Search & filter products (seller side) ───────────────────────────────────
export async function searchProducts(filters: {
  category?: ProductCategory;
  name?: string;
}): Promise<Product[]> {
  const conditions = [eq(products.isAvailable, true)];

  if (filters.category) {
    conditions.push(eq(products.category, filters.category));
  }

  if (filters.name) {
    conditions.push(ilike(products.name, `%${filters.name}%`));
  }

  return db
    .select()
    .from(products)
    .where(and(...conditions));
}
