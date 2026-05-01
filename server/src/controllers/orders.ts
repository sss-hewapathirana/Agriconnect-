import { Request, Response } from "express";
import {
  createOrder,
  getOrdersBySeller,
  getOrdersByFarmer,
  getOrderById,
  acceptOrder,
  rejectOrder,
} from "../db/queries/orders.js";
import { getDbUser } from "../middleware/auth.js";

// ─── POST /api/orders ────────────────────────────────────────────────────────
// Seller only — place an order to a farmer
export async function createOrderHandler(req: Request, res: Response) {
  try {
    const dbUser = getDbUser(req);
    const { farmerId, productName, quantity, unit, deadline, notes } = req.body;

    const order = await createOrder({
      sellerId: dbUser.id,
      farmerId,
      productName,
      quantity,
      unit,
      deadline,
      notes,
    });

    res.status(201).json({ order });
  } catch (err) {
    console.error("[createOrder]", err);
    res.status(500).json({ error: "Failed to place order" });
  }
}

// ─── GET /api/orders ──────────────────────────────────────────────────────────
// Returns orders relevant to the authenticated user (farmer or seller)
export async function listOrders(req: Request, res: Response) {
  try {
    const dbUser = getDbUser(req);

    const orders =
      dbUser.role === "seller"
        ? await getOrdersBySeller(dbUser.id)
        : await getOrdersByFarmer(dbUser.id);

    res.json({ orders });
  } catch (err) {
    console.error("[listOrders]", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
export async function getOrderHandler(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const dbUser = getDbUser(req);

    const order = await getOrderById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Only the involved seller or farmer can view this order
    if (order.sellerId !== dbUser.id && order.farmerId !== dbUser.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ order });
  } catch (err) {
    console.error("[getOrder]", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
}

// ─── PATCH /api/orders/:id/status ────────────────────────────────────────────
// Farmer only — accept or reject an incoming order
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const dbUser = getDbUser(req);
    const { status } = req.body;

    const existing = await getOrderById(id);
    if (!existing) return res.status(404).json({ error: "Order not found" });

    if (existing.farmerId !== dbUser.id) {
      return res.status(403).json({ error: "Only the receiving farmer can update order status" });
    }

    if (existing.status !== "pending") {
      return res.status(409).json({
        error: `Order is already ${existing.status} and cannot be changed`,
      });
    }

    const updated =
      status === "accepted"
        ? await acceptOrder(id, dbUser.id)
        : await rejectOrder(id, dbUser.id);

    res.json({ order: updated });
  } catch (err) {
    console.error("[updateOrderStatus]", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
}
