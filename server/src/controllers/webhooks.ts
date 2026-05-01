import { Request, Response } from "express";
import { Webhook } from "svix";
import {
  createUser,
  findUserByClerkId,
  updateUser,
  deleteUserByClerkId,
} from "../db/queries/users.js";

// ─── POST /api/webhooks/clerk ─────────────────────────────────────────────────
// Verifies the Svix signature and syncs Clerk user lifecycle events to our DB
export async function clerkWebhookHandler(req: Request, res: Response) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  // Svix headers
  const svixId = req.headers["svix-id"] as string;
  const svixTimestamp = req.headers["svix-timestamp"] as string;
  const svixSignature = req.headers["svix-signature"] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ error: "Missing Svix headers" });
  }

  // Verify signature
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(JSON.stringify(req.body), {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  const { type, data } = evt;
  console.log(`📨 Clerk webhook: ${type}`);

  try {
    switch (type) {
      case "user.created": {
        const existing = await findUserByClerkId(data.id);
        if (!existing) {
          // Create a minimal record — role/phone/location added via POST /api/users
          const primaryEmail = data.email_addresses?.[0]?.email_address ?? "";
          const fullName =
            [data.first_name, data.last_name].filter(Boolean).join(" ") || "Unknown";

          await createUser({
            clerkId: data.id,
            email: primaryEmail,
            name: fullName,
            role: "seller", // default role; user updates this in onboarding
            avatarUrl: data.image_url ?? null,
          });
          console.log(`✅ Created DB user for Clerk ID: ${data.id}`);
        }
        break;
      }

      case "user.updated": {
        const primaryEmail = data.email_addresses?.[0]?.email_address ?? undefined;
        const fullName =
          [data.first_name, data.last_name].filter(Boolean).join(" ") || undefined;

        await updateUser(data.id, {
          ...(fullName ? { name: fullName } : {}),
          avatarUrl: data.image_url ?? undefined,
        });

        console.log(`✅ Updated DB user for Clerk ID: ${data.id}`);
        break;
      }

      case "user.deleted": {
        await deleteUserByClerkId(data.id);
        console.log(`🗑️ Deleted DB user for Clerk ID: ${data.id}`);
        break;
      }

      default:
        console.log(`Unhandled Clerk event: ${type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`Error processing webhook event ${type}:`, err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
