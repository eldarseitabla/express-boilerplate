import { Response, Request, NextFunction } from 'express';
import { NotFoundError } from '../errors';

/**
 * Error handler middleware.
 * Uses status code from error if present.
 */
const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Not Found URL: ${req.originalUrl}`);
  next(error);
};

export { notFoundMiddleware };
