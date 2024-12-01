export class CustomError extends Error {
  public readonly code: string;
  public readonly details?: string;

  constructor({
    code,
    message,
    details,
  }: {
    code: string;
    message: string;
    details?: any;
  }) {
    super(message);
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
