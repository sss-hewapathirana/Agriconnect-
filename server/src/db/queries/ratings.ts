import { db } from "../index.js";
import { ratings } from "../schema/ratings.js";
import { eq, and, avg, count, sql } from "drizzle-orm";

// ─── Types ────────────────────────────────────────────────────────────────────
export type NewRating = typeof ratings.$inferInsert;
export type Rating = typeof ratings.$inferSelect;

// ─── Create or update a rating (upsert — one per seller-farmer pair) ─────────
export async function upsertRating(data: NewRating): Promise<Rating> {
  const [rating] = await db
    .insert(ratings)
    .values(data)
    .onConflictDoUpdate({
      target: [ratings.sellerId, ratings.farmerId],
      set: {
        stars: data.stars,
        comment: data.comment,
        updatedAt: new Date(),
      },
    })
    .returning();
  return rating;
}

// ─── Get all ratings for a farmer ────────────────────────────────────────────
export async function getRatingsByFarmer(farmerId: string): Promise<Rating[]> {
  return db.select().from(ratings).where(eq(ratings.farmerId, farmerId));
}

// ─── Get average rating + count for a farmer ─────────────────────────────────
export async function getFarmerRatingSummary(
  farmerId: string
): Promise<{ averageStars: number; totalRatings: number }> {
  const [result] = await db
    .select({
      averageStars: avg(ratings.stars),
      totalRatings: count(ratings.id),
    })
    .from(ratings)
    .where(eq(ratings.farmerId, farmerId));

  return {
    averageStars: result?.averageStars ? parseFloat(String(result.averageStars)) : 0,
    totalRatings: result?.totalRatings ?? 0,
  };
}

// ─── Get a seller's existing rating for a farmer ─────────────────────────────
export async function getSellerRatingForFarmer(
  sellerId: string,
  farmerId: string
): Promise<Rating | undefined> {
  const [rating] = await db
    .select()
    .from(ratings)
    .where(and(eq(ratings.sellerId, sellerId), eq(ratings.farmerId, farmerId)));
  return rating;
}
