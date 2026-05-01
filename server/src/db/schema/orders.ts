import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  pgEnum,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "accepted",
  "rejected",
]);

// ─── Orders Table ─────────────────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  farmerId: uuid("farmer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productName: varchar("product_name", { length: 150 }).notNull(),
  quantity: integer("quantity").notNull(),
  unit: varchar("unit", { length: 30 }).notNull().default("kg"),
  deadline: date("deadline").notNull(),
  notes: text("notes"), // Optional message from seller
  status: orderStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────
export const ordersRelations = relations(orders, ({ one }) => ({
  seller: one(users, {
    fields: [orders.sellerId],
    references: [users.id],
    relationName: "sellerOrders",
  }),
  farmer: one(users, {
    fields: [orders.farmerId],
    references: [users.id],
    relationName: "farmerOrders",
  }),
}));
