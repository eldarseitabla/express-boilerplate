import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DITypes } from '../keys';
import { container } from '../app';
import { BookService } from '../services';

@injectable()
export class BookController {
  constructor (@inject(DITypes.TYPES.BookService) private bookService: BookService) {}

  async getBooks (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.bookService.findBook();
      res.send([]);
    } catch (err) {
      next(err);
    }
  }

  async getBook (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.bookService.getBook();
      res.send({});
    } catch (err) {
      next(err);
    }
  }

  async createBook (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.bookService.createBook();
      res.send({});
    } catch (err) {
      next(err);
    }
  }


  async updateBook (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.bookService.updateBook();
      res.send({});
    } catch (err) {
      next(err);
    }
  }

  async removeBook (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.bookService.removeBook();
      res.send({});
    } catch (err) {
      next(err);
    }
  }
}

export const bookRouter: Router = Router();

bookRouter.get('', async (req: Request, res: Response, next: NextFunction) => {
  container.get<BookController>(DITypes.TYPES.BookController).getBooks(req, res, next);
});

bookRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  container.get<BookController>(DITypes.TYPES.BookController).getBook(req, res, next);
});

bookRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
  container.get<BookController>(DITypes.TYPES.BookController).createBook(req, res, next);
});

bookRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  container.get<BookController>(DITypes.TYPES.BookController).updateBook(req, res, next);
});

bookRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  container.get<BookController>(DITypes.TYPES.BookController).removeBook(req, res, next);
});
