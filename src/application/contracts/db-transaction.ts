export interface DbTransaction {
  openTransaction: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  closeTransaction: () => Promise<void>;
}
