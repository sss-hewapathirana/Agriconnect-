import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { requireDbUser, requireRole } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  searchProductsSchema,
} from "../validators/schemas.js";
import {
  createProductHandler,
  listProducts,
  getFarmerProductsHandler,
  getMyProductsHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../controllers/products.js";

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get("/", validateQuery(searchProductsSchema), listProducts);
router.get("/farmer/:farmerId", getFarmerProductsHandler);

// ─── Auth required ────────────────────────────────────────────────────────────
router.get("/mine", requireAuth(), requireDbUser, requireRole("farmer"), getMyProductsHandler);

// ─── Farmer only ──────────────────────────────────────────────────────────────
router.post(
  "/",
  requireAuth(),
  requireDbUser,
  requireRole("farmer"),
  validateBody(createProductSchema),
  createProductHandler
);

router.patch(
  "/:id",
  requireAuth(),
  requireDbUser,
  requireRole("farmer"),
  validateBody(updateProductSchema),
  updateProductHandler
);

router.delete(
  "/:id",
  requireAuth(),
  requireDbUser,
  requireRole("farmer"),
  deleteProductHandler
);

export default router;
