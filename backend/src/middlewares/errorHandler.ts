import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

type AppError = Error & { status?: number };

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);

  const appError = (err as AppError) || ({} as AppError);
  const status = appError.status ?? 500;
  const message = err instanceof Error ? err.message : "Internal server error";

  res.status(status).json({
    success: false,
    message,
  });
};
