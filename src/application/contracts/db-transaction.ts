export interface DbTransaction {
  openTransaction: () => Promise<void>;
  commit: () => Promise<void>;
  closeTransaction: () => Promise<void>;
}
