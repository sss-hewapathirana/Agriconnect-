import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { requireDbUser, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createUserSchema, updateUserSchema } from "../validators/schemas.js";
import {
  registerUser,
  getUserById,
  getMe,
  updateMe,
  listFarmers,
  getFarmer,
} from "../controllers/users.js";
import { getFarmerReviews } from "../controllers/ratings.js";

const router = Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/farmers", listFarmers);
router.get("/farmers/:id", getFarmer);
router.get("/farmers/:id/reviews", getFarmerReviews);
router.get("/:id", getUserById);

// ─── Auth required ────────────────────────────────────────────────────────────
// Onboarding — register role after Clerk signup
router.post("/", requireAuth(), validateBody(createUserSchema), registerUser);

// ─── Auth + DB user required ──────────────────────────────────────────────────
router.get("/me", requireAuth(), requireDbUser, getMe);
router.patch("/me", requireAuth(), requireDbUser, validateBody(updateUserSchema), updateMe);

export default router;
