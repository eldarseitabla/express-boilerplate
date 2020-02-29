export class BaseError extends Error {
  statusCode: number;

  constructor(status: number, message: string) {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    this.statusCode = status;

    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpExceptionError extends BaseError {
  constructor(status: number, message: string) {
    super(status, message);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(404, message);
  }
}
