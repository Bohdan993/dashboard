export class UnauthorizedError extends Error {
    constructor(message: string) {
      super(message); // (1)
      this.name = "UnauthorizedError"; // (2)
    }
  }