import { Response, Request, NextFunction } from 'express';
import httpErrors from 'http-errors';

/**
 * Error handler middleware.
 * Uses status code from error if present.
 */
const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const error = new httpErrors.NotFound(`${req.method} ${req.originalUrl}`);
  next(error);
};

export { notFoundMiddleware };
