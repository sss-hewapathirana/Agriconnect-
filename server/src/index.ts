import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import reviewRoutes from "./routes/reviews.js";
import webhookRoutes from "./routes/webhooks.js";

// Load env before anything else
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
// Webhooks need raw body for signature verification, so we mount them BEFORE express.json()
app.use("/api/webhooks", webhookRoutes);
app.use(express.json());
app.use(clerkMiddleware());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Logging middleware to debug URLs
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (_req, res) => {
  res.send("<h1>Agriconnect API</h1><p>The server is running correctly.</p>");
});


// ─── Global error handler ─────────────────────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Agriconnect server running on http://localhost:${PORT}`);
});

export default app;
