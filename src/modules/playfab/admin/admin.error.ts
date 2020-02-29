import { BaseError } from '../../../errors';

export class AdminError extends BaseError {
  constructor(status: number, message: string) {
    super(status, message);
  }
}
