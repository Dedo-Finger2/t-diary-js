export class MethodNotImplemented extends Error {
  constructor() {
    super();
    this.name = "MethodNotImplemented";
    this.message = "Method not implemented.";
  }
}
