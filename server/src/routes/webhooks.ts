import { Router } from "express";
import express from "express";
import { clerkWebhookHandler } from "../controllers/webhooks.js";

const router = Router();

// Raw body needed for Svix signature verification
router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  (req, _res, next) => {
    // Parse the raw buffer back to JSON for controller use
    if (Buffer.isBuffer(req.body)) {
      req.body = JSON.parse(req.body.toString("utf8"));
    }
    next();
  },
  clerkWebhookHandler
);

export default router;
