export class ConnectionNoFoundError extends Error {
  constructor() {
    super('No connection was found');
    this.name = 'ConnectionNoFoundError';
  }
}
