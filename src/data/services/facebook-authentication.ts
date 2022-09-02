import { AccessToken, FacebookAccount } from '@/domain/models';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from '@/data/contracts/repositories';
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { TokenGenerator } from '@/data/contracts/crypto';

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
      SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator,
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser(params);
    if (!fbData) {
      return new AuthenticationError();
    }
    const accountData = await this.userAccountRepository.load({ email: fbData.email });
    const facebookAccount = new FacebookAccount(fbData, accountData);
    const { id } = await this.userAccountRepository.saveWithFacebook(facebookAccount);
    const token = await this.crypto.generateToken({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });
    return new AccessToken(token);
  }
}
