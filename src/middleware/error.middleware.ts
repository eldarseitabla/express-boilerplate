import { ErrorRequestHandler, Response, Request, NextFunction } from 'express';
import { getLogger } from 'log4js';
import httpErrors from 'http-errors';

const logger = getLogger('[middleware.errorMiddleware]');

/**
 * Error handler middleware.
 * Uses status code from error if present.
 */
const errorMiddleware: ErrorRequestHandler = async (error: httpErrors.HttpError, req: Request, res: Response, next: NextFunction) => {
  if (error) {
    const status = error.statusCode || 500;
    res.status(status);
    const message = { ...error };
    if (/* !config.error.emitStackTrace */ !(false)) { // eslint-disable-line
      delete message.stack;
    }
    if (error.status === 403 || error.status === 401) {
      logger.warn(error);
    } else {
      logger.error(error);
    }
    res.send(message);
  } else {
    next();
  }
};

export { errorMiddleware };
