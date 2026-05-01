import { db } from "../index.js";
import { orders } from "../schema/orders.js";
import { eq, and } from "drizzle-orm";

// ─── Types ────────────────────────────────────────────────────────────────────
export type NewOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;

// ─── Place an order (seller → farmer) ────────────────────────────────────────
export async function createOrder(data: NewOrder): Promise<Order> {
  const [order] = await db.insert(orders).values(data).returning();
  return order;
}

// ─── Get all orders placed by a seller ───────────────────────────────────────
export async function getOrdersBySeller(sellerId: string): Promise<Order[]> {
  return db.select().from(orders).where(eq(orders.sellerId, sellerId));
}

// ─── Get all incoming orders for a farmer ────────────────────────────────────
export async function getOrdersByFarmer(farmerId: string): Promise<Order[]> {
  return db.select().from(orders).where(eq(orders.farmerId, farmerId));
}

// ─── Get a single order by ID ─────────────────────────────────────────────────
export async function getOrderById(id: string): Promise<Order | undefined> {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  return order;
}

// ─── Accept an order (farmer only) ───────────────────────────────────────────
export async function acceptOrder(
  orderId: string,
  farmerId: string
): Promise<Order> {
  const [updated] = await db
    .update(orders)
    .set({ status: "accepted", updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.farmerId, farmerId)))
    .returning();
  return updated;
}

// ─── Reject an order (farmer only) ───────────────────────────────────────────
export async function rejectOrder(
  orderId: string,
  farmerId: string
): Promise<Order> {
  const [updated] = await db
    .update(orders)
    .set({ status: "rejected", updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.farmerId, farmerId)))
    .returning();
  return updated;
}
