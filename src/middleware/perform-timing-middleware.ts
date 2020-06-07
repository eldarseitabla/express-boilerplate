import { Request, Response } from 'express';
import responseTime from 'response-time';
import { getLogger } from 'log4js';

const logger = getLogger('[middleware.performTimingMiddleware]');

const performTimingMiddleware = () => {
  return responseTime( (req: Request, res: Response, time: number) => {
    // const stat = (req.method + req.url)
    //   .replace(/[:.]/g, '')
    //   .replace(/\//g, '_');
    logger.info(`${req.method} ${req.originalUrl} - ${time}ms`);
  });
};

export { performTimingMiddleware };
