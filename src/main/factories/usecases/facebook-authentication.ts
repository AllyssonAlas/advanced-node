import { FacebookAuthenticationUsecase } from '@/domain/usecases';
import { makeFacebookApi } from '@/main/factories/api';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';
import { makePgUserAccountRepo } from '@/main/factories/repos';

export const makeFacebookAuthentication = (): FacebookAuthenticationUsecase => {
  return new FacebookAuthenticationUsecase(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenGenerator(),
  );
};
