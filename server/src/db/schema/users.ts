import {
  pgTable,
  uuid,
  varchar,
  text,
  pgEnum,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["farmer", "seller"]);

// ─── Users Table ──────────────────────────────────────────────────────────────
// Clerk owns credentials. We store profile + role data linked by clerkId.
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  role: userRoleEnum("role").notNull(),
  location: varchar("location", { length: 200 }),
  // Farmer-only extended profile fields (nullable for sellers)
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  ordersAsFarmer: many(orders, { relationName: "farmerOrders" }),
  ordersAsSeller: many(orders, { relationName: "sellerOrders" }),
  ratingsGiven: many(ratings, { relationName: "ratingsGiven" }),
  ratingsReceived: many(ratings, { relationName: "ratingsReceived" }),
}));

// ─── Lazy imports to avoid circular refs ──────────────────────────────────────
import { products } from "./products";
import { orders } from "./orders";
import { ratings } from "./ratings";
