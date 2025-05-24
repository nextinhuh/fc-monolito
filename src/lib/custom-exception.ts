export class CustomException extends Error {
    constructor(
      public message: string,
      public status: number = 400
    ) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }