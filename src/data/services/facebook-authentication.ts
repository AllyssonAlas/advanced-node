import { FacebookAccount } from '@/domain/models';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from '@/data/contracts/repositories';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
      SaveFacebookAccountRepository,
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData) {
      const accountData = await this.userAccountRepository.load({ email: fbData.email });
      const facebookAccount = new FacebookAccount(fbData, accountData);
      await this.userAccountRepository.saveWithFacebook(facebookAccount);
    }
    return new AuthenticationError();
  }
}
