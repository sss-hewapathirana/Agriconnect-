import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  pgEnum,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const productCategoryEnum = pgEnum("product_category", [
  "fruits",
  "vegetables",
  "animal_products",
]);

// ─── Products Table ───────────────────────────────────────────────────────────
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  farmerId: uuid("farmer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 150 }).notNull(),
  category: productCategoryEnum("category").notNull(),
  description: text("description"),
  pricePerUnit: numeric("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 30 }).notNull().default("kg"), // e.g. kg, dozen, litre
  availableQuantity: integer("available_quantity").notNull().default(0),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────
export const productsRelations = relations(products, ({ one }) => ({
  farmer: one(users, {
    fields: [products.farmerId],
    references: [users.id],
  }),
}));
