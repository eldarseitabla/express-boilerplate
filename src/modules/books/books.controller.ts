import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import TYPES from '../../constant/types';
import { container } from '../../app';
import { IBooksService } from './books.service';

export interface IBooksController {
    findBooks(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBook(req: Request, res: Response, next: NextFunction): Promise<void>;
    createBook(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateBook(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeBook(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@injectable()
export class BooksController implements IBooksController {
  constructor(@inject(TYPES.BooksService) private booksService: IBooksService) {}

  async findBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.booksService.findBooks();
      res.send({});
    } catch (err) {
      next(err);
    }
  }

  async getBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.booksService.getBook();
      res.send({});
    } catch (err) {
      next(err);
    }
  }

  async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.booksService.createBook();
      res.send({});
    } catch (err) {
      next(err);
    }
  }


  async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.booksService.updateBook();
      res.send({});
    } catch (err) {
      next(err);
    }
  }

  async removeBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.booksService.removeBook();
      res.send({});
    } catch (err) {
      next(err);
    }
  }
}

const router: Router = Router();

router.get('', async(req: Request, res: Response, next: NextFunction) => {
  container.get<IBooksController>(TYPES.BooksController).findBooks(req, res, next);
});

router.get('/:id', async(req: Request, res: Response, next: NextFunction) => {
  container.get<IBooksController>(TYPES.BooksController).getBook(req, res, next);
});

router.post('', async(req: Request, res: Response, next: NextFunction) => {
  container.get<IBooksController>(TYPES.BooksController).createBook(req, res, next);
});

router.patch('/:id', async(req: Request, res: Response, next: NextFunction) => {
  container.get<IBooksController>(TYPES.BooksController).updateBook(req, res, next);
});

router.delete('/:id', async(req: Request, res: Response, next: NextFunction) => {
  container.get<IBooksController>(TYPES.BooksController).removeBook(req, res, next);
});

export default router;
