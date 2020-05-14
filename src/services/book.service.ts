import { injectable } from 'inversify';

@injectable()
export class BookService {
  async findBook (): Promise<string[]> {
    return [];
  }

  async getBook (): Promise<object> {
    return {};
  }

  async createBook (): Promise<void> {
    return;
  }

  async updateBook (): Promise<void> {
    return;
  }

  async removeBook (): Promise<void> {
    return;
  }
}
