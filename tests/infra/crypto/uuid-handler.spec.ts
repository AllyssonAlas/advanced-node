import { v4 } from 'uuid';
import { mocked } from 'ts-jest/utils';

import { UUIDHandler } from '@/infra/crypto';

jest.mock('uuid');

describe('UUIDHandler', () => {
  it('Should call uuid.v4', () => {
    const sut = new UUIDHandler();

    sut.uuid({ key: 'any_key' });

    expect(v4).toHaveBeenCalledTimes(1);
  });

  it('Should return correct uuid', () => {
    mocked(v4).mockReturnValueOnce('any_uuid');
    const sut = new UUIDHandler();

    const uuid = sut.uuid({ key: 'any_key' });

    expect(uuid).toBe('any_key_any_uuid');
  });
});
