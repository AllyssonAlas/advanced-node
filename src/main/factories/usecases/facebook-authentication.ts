import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases';
import { makeFacebookApi } from '@/main/factories/api';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';
import { makePgUserAccountRepo } from '@/main/factories/repos';

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenGenerator(),
  );
};
