import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: err.flatten(),
    });
  }

  if (err instanceof Error) {
    return res.status(400).json({ success: false, error: err.message });
  }

  res.status(500).json({ success: false, error: "Internal server error." });
};

export default errorHandler;
