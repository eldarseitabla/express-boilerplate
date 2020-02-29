import { BaseError } from '../../../errors';

export class ClientError extends BaseError {
  constructor(status: number, message: string) {
    super(status, message);
  }
}
