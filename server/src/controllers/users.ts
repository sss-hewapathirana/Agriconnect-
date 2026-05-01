import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import {
  createUser,
  findUserByClerkId,
  findUserById,
  updateUser,
  getAllFarmers,
  getFarmerProfile,
} from "../db/queries/users.js";
import { getDbUser } from "../middleware/auth.js";

// ─── POST /api/users ──────────────────────────────────────────────────────────
// Called after Clerk signup to register user in our DB with role
export async function registerUser(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Prevent duplicate registrations
    const existing = await findUserByClerkId(userId);
    if (existing) {
      return res.status(409).json({ error: "User already registered", user: existing });
    }

    const { role, name, phone, location } = req.body;

    // Email is provided by Clerk — get it from the session claims
    const sessionClaims = getAuth(req);
    // We'll use the clerkId for now; email will be synced via webhook
    const email = (sessionClaims as any)?.sessionClaims?.email as string | undefined;

    const user = await createUser({
      clerkId: userId,
      email: email ?? `${userId}@clerk.local`, // fallback; webhook will correct this
      name,
      phone,
      location,
      role,
    });

    res.status(201).json({ user });
  } catch (err) {
    console.error("[registerUser]", err);
    res.status(500).json({ error: "Failed to register user" });
  }
}

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await findUserById(id);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Strip sensitive fields for public view
    const { isActive, ...publicUser } = user;
    res.json({ user: publicUser });
  } catch (err) {
    console.error("[getUserById]", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

// ─── GET /api/users/me ────────────────────────────────────────────────────────
export async function getMe(req: Request, res: Response) {
  try {
    const dbUser = getDbUser(req);
    res.json({ user: dbUser });
  } catch (err) {
    console.error("[getMe]", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

// ─── PATCH /api/users/me ──────────────────────────────────────────────────────
export async function updateMe(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const updated = await updateUser(userId, req.body);
    res.json({ user: updated });
  } catch (err) {
    console.error("[updateMe]", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

// ─── GET /api/farmers ─────────────────────────────────────────────────────────
// Public feed of all farmers (for sellers to browse)
export async function listFarmers(_req: Request, res: Response) {
  try {
    const farmers = await getAllFarmers();
    res.json({ farmers });
  } catch (err) {
    console.error("[listFarmers]", err);
    res.status(500).json({ error: "Failed to fetch farmers" });
  }
}

// ─── GET /api/farmers/:id ─────────────────────────────────────────────────────
export async function getFarmer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const farmer = await getFarmerProfile(id);

    if (!farmer || farmer.role !== "farmer") {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json({ farmer });
  } catch (err) {
    console.error("[getFarmer]", err);
    res.status(500).json({ error: "Failed to fetch farmer" });
  }
}
