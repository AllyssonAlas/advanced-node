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
    createQueryRunnerSpy = jest.fn().mockReturnValue({});
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
});
