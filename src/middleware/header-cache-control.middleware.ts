import {Request, Response, NextFunction} from 'express';

export function headerCacheControl(req: Request, res: Response, next: NextFunction): void {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-cache, max-age=0');
  }
  next();
}
