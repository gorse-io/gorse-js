export class GorseException extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.name = "GorseException";
    this.code = code;
  }
}
