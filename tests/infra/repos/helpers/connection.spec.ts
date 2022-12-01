import { getConnectionManager, createConnection, getConnection } from 'typeorm';

import { mocked } from 'ts-jest/utils';

import { PgConnection } from '@/infra/repos/postgres/helpers';

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn(),
}));

describe('PgConnection', () => {
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
    createQueryRunnerSpy = jest.fn();
    createConnectionSpy = jest.fn().mockResolvedValue({ createQueryRunner: createQueryRunnerSpy });
    mocked(createConnection).mockImplementation(createConnectionSpy);
    getConnectionSpy = jest.fn().mockReturnValue({ createQueryRunner: createQueryRunnerSpy });
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
});
