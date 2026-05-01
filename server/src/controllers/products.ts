import { Request, Response } from "express";
import {
  createProduct,
  getFarmerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../db/queries/products.js";
import { getDbUser } from "../middleware/auth.js";
import type { ProductCategory } from "../db/queries/products.js";

// ─── POST /api/products ───────────────────────────────────────────────────────
// Farmer only
export async function createProductHandler(req: Request, res: Response) {
  try {
    const dbUser = getDbUser(req);
    const { name, category, description, pricePerUnit, unit, availableQuantity } = req.body;

    const product = await createProduct({
      farmerId: dbUser.id,
      name,
      category,
      description,
      pricePerUnit: String(pricePerUnit),
      unit,
      availableQuantity,
    });

    res.status(201).json({ product });
  } catch (err) {
    console.error("[createProduct]", err);
    res.status(500).json({ error: "Failed to create product" });
  }
}

// ─── GET /api/products ────────────────────────────────────────────────────────
// Public — sellers search/browse products, filtered by category & name
export async function listProducts(req: Request, res: Response) {
  try {
    const { category, name } = (req as any).validatedQuery ?? req.query;

    const products = await searchProducts({
      category: category as ProductCategory | undefined,
      name: name as string | undefined,
    });

    res.json({ products });
  } catch (err) {
    console.error("[listProducts]", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// ─── GET /api/products/farmer/:farmerId ───────────────────────────────────────
// Products for a specific farmer
export async function getFarmerProductsHandler(req: Request, res: Response) {
  try {
    const farmerId = req.params.farmerId as string;
    const products = await getFarmerProducts(farmerId);
    res.json({ products });
  } catch (err) {
    console.error("[getFarmerProducts]", err);
    res.status(500).json({ error: "Failed to fetch farmer's products" });
  }
}

// ─── PATCH /api/products/:id ──────────────────────────────────────────────────
// Farmer only — can only update their own products
export async function updateProductHandler(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const dbUser = getDbUser(req);

    // Verify ownership
    const existing = await getProductById(id);
    if (!existing) return res.status(404).json({ error: "Product not found" });
    if (existing.farmerId !== dbUser.id) {
      return res.status(403).json({ error: "You do not own this product" });
    }

    const { name, category, description, pricePerUnit, unit, availableQuantity, isAvailable } =
      req.body;

    const updated = await updateProduct(id, dbUser.id, {
      name,
      category,
      description,
      pricePerUnit: pricePerUnit !== undefined ? String(pricePerUnit) : undefined,
      unit,
      availableQuantity,
      isAvailable,
    });

    res.json({ product: updated });
  } catch (err) {
    console.error("[updateProduct]", err);
    res.status(500).json({ error: "Failed to update product" });
  }
}

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
// Farmer only — can only delete their own products
export async function deleteProductHandler(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const dbUser = getDbUser(req);

    const existing = await getProductById(id);
    if (!existing) return res.status(404).json({ error: "Product not found" });
    if (existing.farmerId !== dbUser.id) {
      return res.status(403).json({ error: "You do not own this product" });
    }

    await deleteProduct(id, dbUser.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("[deleteProduct]", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
}
