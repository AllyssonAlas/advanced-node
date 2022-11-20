import { UserProfile } from '@/domain/entities';

describe('UserProfile', () => {
  let sut: UserProfile;

  beforeEach(() => {
    sut = new UserProfile('any_id');
  });

  it('Should create with empty initials when picture  and name are provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined,
    });
  });

  it('Should create with empty initials when only picture is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined,
    });
  });

  it('Should create with first letter and last names', () => {
    sut.setPicture({ name: 'allysson alas santos' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'AS',
    });
  });

  it('Should create with first two letters of the first name', () => {
    sut.setPicture({ name: 'allysson' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'AL',
    });
  });

  it('Should create with first letter', () => {
    sut.setPicture({ name: 'a' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'A',
    });
  });

  it('Should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({});

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined,
    });
  });
});
