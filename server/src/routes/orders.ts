import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { requireDbUser, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/schemas.js";
import {
  createOrderHandler,
  listOrders,
  getOrderHandler,
  updateOrderStatus,
} from "../controllers/orders.js";

const router = Router();

// All order routes require auth + DB user
router.use(requireAuth(), requireDbUser);

// ─── Seller: place order ──────────────────────────────────────────────────────
router.post(
  "/",
  requireRole("seller"),
  validateBody(createOrderSchema),
  createOrderHandler
);

// ─── Both roles: view own orders ──────────────────────────────────────────────
router.get("/", listOrders);
router.get("/mine", listOrders);
router.get("/:id", getOrderHandler);

// ─── Farmer: accept / reject ──────────────────────────────────────────────────
router.patch(
  "/:id/status",
  requireRole("farmer"),
  validateBody(updateOrderStatusSchema),
  updateOrderStatus
);

export default router;
