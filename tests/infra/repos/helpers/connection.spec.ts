import { getConnectionManager, createConnection, getConnection } from 'typeorm';

import { mocked } from 'ts-jest/utils';

import { PgConnection, ConnectionNoFoundError } from '@/infra/repos/postgres/helpers';

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn(),
}));

describe('PgConnection', () => {
  let rollbackTransactionSpy: jest.Mock;
  let commitTransactionSpy: jest.Mock;
  let releaseSpy: jest.Mock;
  let startTransactionSpy: jest.Mock;
  let closeSpy: jest.Mock;
  let hasSpy: jest.Mock;
  let getConnectionManagerSpy: jest.Mock;
  let createQueryRunnerSpy: jest.Mock;
  let getConnectionSpy: jest.Mock;
  let createConnectionSpy: jest.Mock;
  let sut: PgConnection;

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(true);
    getConnectionManagerSpy = jest.fn().mockReturnValue({ has: hasSpy });
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy);
    rollbackTransactionSpy = jest.fn();
    commitTransactionSpy = jest.fn();
    releaseSpy = jest.fn();
    startTransactionSpy = jest.fn();
    createQueryRunnerSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy,
      release: releaseSpy,
      commitTransaction: commitTransactionSpy,
      rollbackTransaction: rollbackTransactionSpy,
    });
    createConnectionSpy = jest.fn().mockResolvedValue({ createQueryRunner: createQueryRunnerSpy });
    mocked(createConnection).mockImplementation(createConnectionSpy);
    closeSpy = jest.fn();
    getConnectionSpy = jest.fn().mockReturnValue({
      createQueryRunner: createQueryRunnerSpy,
      close: closeSpy,
    });
    mocked(getConnection).mockImplementation(getConnectionSpy);
  });

  beforeEach(() => {
    sut = PgConnection.getInstance();
  });

  it('Should have only one instance', () => {
    const sut2 = PgConnection.getInstance();

    expect(sut).toBe(sut2);
  });

  it('Should create a new connection', async () => {
    hasSpy.mockReturnValueOnce(false);

    await sut.connect();

    expect(createConnectionSpy).toHaveBeenCalledWith();
    expect(createConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createQueryRunnerSpy).toHaveBeenCalledWith();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });

  it('Should use an existing connection', async () => {
    await sut.connect();

    expect(getConnectionSpy).toHaveBeenCalledWith();
    expect(getConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createQueryRunnerSpy).toHaveBeenCalledWith();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });

  it('Should close connection', async () => {
    await sut.connect();
    await sut.disconnect();

    expect(closeSpy).toHaveBeenCalledWith();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('Should return ConnectionNoFoundError on disconnect if connection is no found', async () => {
    const promise = sut.disconnect();

    expect(closeSpy).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new ConnectionNoFoundError());
  });

  it('Should open transaction', async () => {
    await sut.connect();
    await sut.openTransaction();

    expect(startTransactionSpy).toHaveBeenCalledWith();
    expect(startTransactionSpy).toHaveBeenCalledTimes(1);

    await sut.disconnect();
  });

  it('Should return ConnectionNoFoundError on openTransaction if connection is no found', async () => {
    const promise = sut.openTransaction();

    expect(startTransactionSpy).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new ConnectionNoFoundError());
  });

  it('Should close transaction', async () => {
    await sut.connect();
    await sut.closeTransaction();

    expect(releaseSpy).toHaveBeenCalledWith();
    expect(releaseSpy).toHaveBeenCalledTimes(1);

    await sut.disconnect();
  });

  it('Should return ConnectionNoFoundError on closeTransaction if connection is no found', async () => {
    const promise = sut.closeTransaction();

    expect(releaseSpy).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new ConnectionNoFoundError());
  });

  it('Should commit transaction', async () => {
    await sut.connect();
    await sut.commit();

    expect(commitTransactionSpy).toHaveBeenCalledWith();
    expect(commitTransactionSpy).toHaveBeenCalledTimes(1);

    await sut.disconnect();
  });

  it('Should return ConnectionNoFoundError on commit if connection is no found', async () => {
    const promise = sut.commit();

    expect(commitTransactionSpy).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new ConnectionNoFoundError());
  });

  it('Should rollback transaction', async () => {
    await sut.connect();
    await sut.rollback();

    expect(rollbackTransactionSpy).toHaveBeenCalledWith();
    expect(rollbackTransactionSpy).toHaveBeenCalledTimes(1);

    await sut.disconnect();
  });

  it('Should return ConnectionNoFoundError on rollback if connection is no found', async () => {
    const promise = sut.commit();

    expect(rollbackTransactionSpy).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new ConnectionNoFoundError());
  });
});
