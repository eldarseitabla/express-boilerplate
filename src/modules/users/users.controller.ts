import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from '../../constant/types';
import { container } from '../../app';
import { IUsersService } from './users.service';

export interface IUsersController {
    signUp(req: Request, res: Response, next: NextFunction): Promise<void>;
    signIn(req: Request, res: Response, next: NextFunction): Promise<void>;
    signOut(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@injectable()
export class UsersController implements IUsersController {
  constructor(@inject(TYPES.UsersService) private usersService: IUsersService) {}

  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.usersService.signUp();
      res.send({});
    } catch (err) {
      next(err);
    }
  }


  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.usersService.signIn();
      res.send({});
    } catch (err) {
      next(err);
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.usersService.signOut();
      res.send({});
    } catch (err) {
      next(err);
    }
  }
}

const router: Router = Router();

router.post('sign-up', async(req: Request, res: Response, next: NextFunction) => {
  container.get<IUsersController>(TYPES.UsersController).signUp(req, res, next);
});

router.post('sign-in', async(req: Request, res: Response, next: NextFunction) => {
  container.get<IUsersController>(TYPES.UsersController).signIn(req, res, next);
});

router.get('sign-out', async(req: Request, res: Response, next: NextFunction) => {
  container.get<IUsersController>(TYPES.UsersController).signOut(req, res, next);
});

export default router;
