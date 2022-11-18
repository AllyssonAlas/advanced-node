import { AccessToken, FacebookAccount } from '@/domain/entities';
import { AuthenticationError } from '@/domain/entities/errors';
import { SaveFacebookAccount, LoadUserAccount } from '@/domain/contracts/repositories';
import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways';

type Input = { token: string };
type Output = { accessToken: string };
export type FacebookAuthentication = (params: Input) => Promise<Output>;
type Setup = (
  facebook: LoadFacebookUser,
  userAccountRepository: LoadUserAccount & SaveFacebookAccount,
  token: TokenGenerator,
) => FacebookAuthentication;

export const setupFacebookAuthentication: Setup = (facebook, userAccountRepository, token) => {
  return async (params) => {
    const fbData = await facebook.loadUser(params);
    if (!fbData) {
      throw new AuthenticationError();
    }
    const accountData = await userAccountRepository.load({ email: fbData.email });
    const facebookAccount = new FacebookAccount(fbData, accountData);
    const { id } = await userAccountRepository.saveWithFacebook(facebookAccount);
    const accessToken = await token.generate({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });
    return { accessToken };
  };
};
