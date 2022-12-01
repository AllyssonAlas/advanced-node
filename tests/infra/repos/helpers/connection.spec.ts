import { getConnectionManager, createConnection } from 'typeorm';

import { mocked } from 'ts-jest/utils';

import { PgConnection } from '@/infra/repos/postgres/helpers';

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn(),
}));

describe('PgConnection', () => {
  it('Should have only one instance', () => {
    const sut = PgConnection.getInstance();
    const sut2 = PgConnection.getInstance();

    expect(sut).toBe(sut2);
  });

  it('Should create a new connection', async () => {
    const getConnectionManagerSpy = jest.fn().mockReturnValueOnce({
      has: jest.fn().mockReturnValueOnce(false),
    });
    mocked(getConnectionManager).mockImplementationOnce(getConnectionManagerSpy);
    const createQueryRunnerSpy = jest.fn();
    const createConnectionSpy = jest.fn().mockResolvedValueOnce({
      createQueryRunner: createQueryRunnerSpy,
    });
    mocked(createConnection).mockImplementationOnce(createConnectionSpy);
    const sut = PgConnection.getInstance();

    await sut.connect();

    expect(createConnectionSpy).toHaveBeenCalledWith();
    expect(createConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createQueryRunnerSpy).toHaveBeenCalledWith();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });
});
