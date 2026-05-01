import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { findUserByClerkId } from "../db/queries/users.js";

// ─── Clerk middleware (attach auth state to every request) ────────────────────
export { clerkMiddleware };

// ─── Require a valid Clerk session ───────────────────────────────────────────
export { requireAuth };

// ─── Require the user to exist in OUR database (post-onboarding) ─────────────
export async function requireDbUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await findUserByClerkId(userId);

  if (!user) {
    res.status(404).json({
      error: "User profile not found. Please complete onboarding.",
    });
    return;
  }

  // Attach to request for use in controllers
  (req as any).dbUser = user;
  next();
}

// ─── Require a specific role ──────────────────────────────────────────────────
export function requireRole(role: "farmer" | "seller") {
  return (req: Request, res: Response, next: NextFunction) => {
    const dbUser = (req as any).dbUser;

    if (!dbUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (dbUser.role !== role) {
      res.status(403).json({
        error: `Access denied. This endpoint requires role: ${role}`,
      });
      return;
    }

    next();
  };
}

// ─── Helper: get auth'd user from request ────────────────────────────────────
export function getDbUser(req: Request) {
  return (req as any).dbUser;
}
