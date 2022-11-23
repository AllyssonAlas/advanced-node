import { v4 } from 'uuid';

import { UUIDHandler } from '@/infra/crypto';

jest.mock('uuid');

describe('UUIDHandler', () => {
  it('Should call uuid.v4', () => {
    const sut = new UUIDHandler();

    sut.uuid({ key: 'any_key' });

    expect(v4).toHaveBeenCalledTimes(1);
  });
});
