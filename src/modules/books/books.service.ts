import { inject, injectable } from 'inversify';

export interface IBooksService {
    findBooks(): Promise<string[]>;
    getBook(): Promise<object>;
    createBook(): Promise<void>;
    updateBook(): Promise<void>;
    removeBook(): Promise<void>;
}

@injectable()
export class BooksService implements IBooksService {
  async findBooks(): Promise<string[]> {
    return [];
  }

  async getBook(): Promise<object> {
    return {};
  }

  async createBook(): Promise<void> {
    return;
  }

  async updateBook(): Promise<void> {
    return;
  }

  async removeBook(): Promise<void> {
    return;
  }
}
