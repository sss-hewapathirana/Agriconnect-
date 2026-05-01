import { db } from "../index.js";
import { users } from "../schema/index.js";
import { eq } from "drizzle-orm";

// ─── Types ────────────────────────────────────────────────────────────────────
export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// ─── Create a new user (called from Clerk webhook) ───────────────────────────
export async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

// ─── Find user by Clerk ID ────────────────────────────────────────────────────
export async function findUserByClerkId(clerkId: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
  return user;
}

// ─── Find user by internal DB ID ─────────────────────────────────────────────
export async function findUserById(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

// ─── Update user profile ──────────────────────────────────────────────────────
export async function updateUser(
  clerkId: string,
  data: Partial<Pick<NewUser, "name" | "phone" | "location" | "bio" | "avatarUrl" | "role">>
): Promise<User> {
  const [updated] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.clerkId, clerkId))
    .returning();
  return updated;
}

// ─── Delete user (on Clerk deletion webhook) ──────────────────────────────────
export async function deleteUserByClerkId(clerkId: string): Promise<void> {
  await db.delete(users).where(eq(users.clerkId, clerkId));
}

// ─── Get all farmers (public feed for sellers) ────────────────────────────────
export async function getAllFarmers(): Promise<User[]> {
  return db
    .select()
    .from(users)
    .where(eq(users.role, "farmer"));
}

// ─── Get public farmer profile ────────────────────────────────────────────────
export async function getFarmerProfile(farmerId: string): Promise<User | undefined> {
  return findUserById(farmerId);
}
