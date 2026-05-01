import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { requireDbUser, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createRatingSchema } from "../validators/schemas.js";
import {
  createReview,
  getFarmerReviews,
  getMyReviewForFarmer,
} from "../controllers/ratings.js";

const router = Router();

// ─── Public: get all reviews for a farmer ────────────────────────────────────
// NOTE: /farmers/:id/reviews is mounted in the main router at /api/farmers
// These routes handle /api/reviews/*
router.post(
  "/",
  requireAuth(),
  requireDbUser,
  requireRole("seller"),
  validateBody(createRatingSchema),
  createReview
);

export default router;
