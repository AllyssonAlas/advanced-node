import { AccessToken, FacebookAccount } from '@/domain/entities';
import { AuthenticationError } from '@/domain/entities/errors';
import { FacebookAuthentication } from '@/domain/features';
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from '@/domain/contracts/repositories';
import { LoadFacebookUserApi } from '@/domain/contracts/apis';
import { TokenGenerator } from '@/domain/contracts/crypto';

export class FacebookAuthenticationUsecase implements FacebookAuthentication {
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
