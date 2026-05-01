import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ─── Ratings Table ────────────────────────────────────────────────────────────
// A seller can rate a farmer only once (enforced via unique constraint)
export const ratings = pgTable(
  "ratings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    farmerId: uuid("farmer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // 0–5 stars, validated at application layer (zod)
    stars: integer("stars").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // One seller can rate one farmer only once
    uniqueSellerFarmer: unique("unique_seller_farmer").on(
      table.sellerId,
      table.farmerId
    ),
  })
);

// ─── Relations ────────────────────────────────────────────────────────────────
export const ratingsRelations = relations(ratings, ({ one }) => ({
  seller: one(users, {
    fields: [ratings.sellerId],
    references: [users.id],
    relationName: "ratingsGiven",
  }),
  farmer: one(users, {
    fields: [ratings.farmerId],
    references: [users.id],
    relationName: "ratingsReceived",
  }),
}));
