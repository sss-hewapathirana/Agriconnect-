import { z } from "zod";

// ─── User / Onboarding ────────────────────────────────────────────────────────
export const createUserSchema = z.object({
  role: z.enum(["farmer", "seller"]),
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20).optional(),
  location: z.string().min(2).max(200).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(7).max(20).optional(),
  location: z.string().min(2).max(200).optional(),
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional(),
});

// ─── Products ────────────────────────────────────────────────────────────────
export const createProductSchema = z.object({
  name: z.string().min(1).max(150),
  category: z.enum(["fruits", "vegetables", "animal_products"]),
  description: z.string().max(1000).optional(),
  pricePerUnit: z
    .number()
    .positive("Price must be positive"),
  unit: z.string().min(1).max(30).default("kg"),
  availableQuantity: z
    .number()
    .int()
    .nonnegative("Quantity cannot be negative"),
});

export const updateProductSchema = createProductSchema.partial().extend({
  isAvailable: z.boolean().optional(),
});

export const searchProductsSchema = z.object({
  category: z.enum(["fruits", "vegetables", "animal_products"]).optional(),
  name: z.string().optional(),
});

// ─── Orders ──────────────────────────────────────────────────────────────────
export const createOrderSchema = z.object({
  farmerId: z.string().uuid("Invalid farmer ID"),
  productName: z.string().min(1).max(150),
  quantity: z.number().int().positive("Quantity must be positive"),
  unit: z.string().min(1).max(30).default("kg"),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline must be YYYY-MM-DD"),
  notes: z.string().max(1000).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

// ─── Ratings ─────────────────────────────────────────────────────────────────
export const createRatingSchema = z.object({
  farmerId: z.string().uuid("Invalid farmer ID"),
  stars: z.number().int().min(0).max(5),
  comment: z.string().max(1000).optional(),
});

// ─── Clerk Webhook ───────────────────────────────────────────────────────────
export const clerkWebhookUserSchema = z.object({
  id: z.string(),
  email_addresses: z.array(
    z.object({
      email_address: z.string().email(),
      id: z.string(),
    })
  ),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  image_url: z.string().optional(),
});
