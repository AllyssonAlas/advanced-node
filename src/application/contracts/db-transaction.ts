export interface DbTransaction {
  openTransaction: () => Promise<void>;
}
