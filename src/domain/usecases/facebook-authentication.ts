import { AccessToken, FacebookAccount } from '@/domain/entities';
import { AuthenticationError } from '@/domain/entities/errors';
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from '@/domain/contracts/repositories';
import { LoadFacebookUserApi } from '@/domain/contracts/apis';
import { TokenGenerator } from '@/domain/contracts/crypto';

export type FacebookAuthentication = (params: {
  token: string;
}) => Promise<{ accessToken: string }>;
type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokenGenerator,
) => FacebookAuthentication;

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepository, crypto) => {
  return async (params) => {
    const fbData = await facebookApi.loadUser(params);
    if (!fbData) {
      throw new AuthenticationError();
    }
    const accountData = await userAccountRepository.load({ email: fbData.email });
    const facebookAccount = new FacebookAccount(fbData, accountData);
    const { id } = await userAccountRepository.saveWithFacebook(facebookAccount);
    const accessToken = await crypto.generateToken({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });
    return { accessToken };
  };
};
