import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from '@/data/contracts/repositories';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
      CreateFacebookAccountRepository,
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData) {
      await this.userAccountRepository.load({ email: fbData.email });
      await this.userAccountRepository.createFromFacebook(fbData);
    }
    return new AuthenticationError();
  }
}
