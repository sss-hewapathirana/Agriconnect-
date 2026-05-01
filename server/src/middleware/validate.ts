import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// ─── Validate request body against a Zod schema ───────────────────────────────
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        issues: result.error.flatten().fieldErrors,
      });
      return;
    }

    req.body = result.data; // replace with parsed/coerced data
    next();
  };
}

// ─── Validate query params against a Zod schema ───────────────────────────────
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({
        error: "Invalid query parameters",
        issues: result.error.flatten().fieldErrors,
      });
      return;
    }

    (req as any).validatedQuery = result.data;
    next();
  };
}
