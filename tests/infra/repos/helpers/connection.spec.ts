import { PgConnection } from '@/infra/repos/postgres/helpers';

describe('PgConnection', () => {
  it('Should have only one instance', () => {
    const sut = PgConnection.getInstance();
    const sut2 = PgConnection.getInstance();

    expect(sut).toBe(sut2);
  });
});
