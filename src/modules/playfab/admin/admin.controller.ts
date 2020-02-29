import { Response, Request, NextFunction } from 'express';
import * as adminService from './admin.service';

export default class AdminController {
  async banUsers(req: Request, res: Response, next: NextFunction) {
    const titleId: string = req.body.titleId; // TODO to DTO
    const bans: any = req.body.bans; // TODO to DTO
    const data = await adminService.banUsers(titleId, bans);
    if (data instanceof Error) {
      next(data);
    } else {
      res.send(data);
    }
  }
}
