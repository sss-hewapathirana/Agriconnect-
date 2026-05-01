import { db } from "../index";
import { users } from "../schema/users";
import { eq } from "drizzle-orm";

// ─── Types ────────────────────────────────────────────────────────────────────
export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// ─── Create a new user ────────────────────────────────────────────────────────
export async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

// ─── Find user by phone (for login) ──────────────────────────────────────────
export async function findUserByPhone(phone: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.phone, phone));
  return user;
}

// ─── Find user by ID ──────────────────────────────────────────────────────────
export async function findUserById(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

// ─── Update user profile ──────────────────────────────────────────────────────
export async function updateUser(
  id: string,
  data: Partial<Pick<NewUser, "name" | "phone" | "location" | "bio" | "avatarUrl">>
): Promise<User> {
  const [updated] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return updated;
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
  const [farmer] = await db
    .select()
    .from(users)
    .where(eq(users.id, farmerId));
  return farmer;
}
