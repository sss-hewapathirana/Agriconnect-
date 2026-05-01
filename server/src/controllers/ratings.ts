import { Request, Response } from "express";
import {
  upsertRating,
  getRatingsByFarmer,
  getFarmerRatingSummary,
  getSellerRatingForFarmer,
} from "../db/queries/ratings.js";
import { getFarmerProfile } from "../db/queries/users.js";
import { getDbUser } from "../middleware/auth.js";

// ─── POST /api/reviews ────────────────────────────────────────────────────────
// Seller only — rate a farmer (creates or updates their review)
export async function createReview(req: Request, res: Response) {
  try {
    const dbUser = getDbUser(req);
    const { farmerId, stars, comment } = req.body;

    // Ensure target is actually a farmer
    const farmer = await getFarmerProfile(farmerId);
    if (!farmer || farmer.role !== "farmer") {
      return res.status(404).json({ error: "Farmer not found" });
    }

    // A seller cannot rate themselves (edge case if role changes)
    if (farmerId === dbUser.id) {
      return res.status(400).json({ error: "You cannot rate yourself" });
    }

    const rating = await upsertRating({
      sellerId: dbUser.id,
      farmerId,
      stars,
      comment,
    });

    res.status(201).json({ rating });
  } catch (err) {
    console.error("[createReview]", err);
    res.status(500).json({ error: "Failed to submit review" });
  }
}

// ─── GET /api/farmers/:id/reviews ────────────────────────────────────────────
// Public — get all reviews + average rating for a farmer
export async function getFarmerReviews(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const farmer = await getFarmerProfile(id);
    if (!farmer || farmer.role !== "farmer") {
      return res.status(404).json({ error: "Farmer not found" });
    }

    const [reviews, summary] = await Promise.all([
      getRatingsByFarmer(id),
      getFarmerRatingSummary(id),
    ]);

    res.json({
      farmerId: id,
      averageStars: summary.averageStars,
      totalRatings: summary.totalRatings,
      reviews,
    });
  } catch (err) {
    console.error("[getFarmerReviews]", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

// ─── GET /api/farmers/:id/reviews/me ─────────────────────────────────────────
// Seller — check if they've already rated this farmer
export async function getMyReviewForFarmer(req: Request, res: Response) {
  try {
    const dbUser = getDbUser(req);
    const { id: farmerId } = req.params;

    const rating = await getSellerRatingForFarmer(dbUser.id, farmerId);
    res.json({ rating: rating ?? null });
  } catch (err) {
    console.error("[getMyReviewForFarmer]", err);
    res.status(500).json({ error: "Failed to fetch your review" });
  }
}
