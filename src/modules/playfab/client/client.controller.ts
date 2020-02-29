import { Response, Request, NextFunction } from 'express';
import * as clientService from './client.service';
import ClientType from './client.type';

export class ClientController {
  async loginWithCustomId(req: Request, res: Response, next: NextFunction) {
    const titleId: string = req.body.titleId; // TODO to DTO
    const customId: string = req.body.customId; // TODO to DTO
    const data = await clientService.loginWithCustomId(titleId, customId);
    if (data instanceof Error) {
      next(data);
    } else {
      res.send(data);
    }
  };

  async getPhotonAuthenticationToken(req: Request, res: Response, next: NextFunction) {
    const titleId: string = req.body.titleId; // TODO to DTO
    const photonApplicationId: string = req.body.photonApplicationId; // TODO to DTO
    const data = await clientService.getPhotonAuthenticationToken(titleId, photonApplicationId);
    if (data instanceof Error) {
      next(data);
    } else {
      res.send(data);
    }
  };

  async getContentDownloadUrl(req: Request, res: Response, next: NextFunction) {
    const titleId: string = req.body.titleId; // TODO to DTO
    const httpMethod: ClientType.Method = req.body.method || ClientType.Method.GET; // TODO to DTO
    const key: string = req.body.key; // TODO to DTO
    const thruCdn: boolean = req.body.thruCdn || true;
    const data = await clientService.getContentDownloadUrl(titleId, httpMethod, key, thruCdn);
    if (data instanceof Error) {
      next(data);
    } else {
      res.send(data);
    }
  };

}

export default ClientController;
