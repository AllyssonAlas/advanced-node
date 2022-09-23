import { FacebookAuthenticationService } from '@/data/services';
import { makeFacebookApi } from '@/main/factories/api';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';
import { makePgUserAccountRepo } from '@/main/factories/repos';

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  return new FacebookAuthenticationService(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenGenerator(),
  );
};
