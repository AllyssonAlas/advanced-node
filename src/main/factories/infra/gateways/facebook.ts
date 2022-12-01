import { FacebookApi } from '@/infra/gateways';
import { env } from '@/main/config/env';
import { makeAxiosClient } from '@/main/factories/infra/gateways';

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(makeAxiosClient(), env.facebookApi.clientId, env.facebookApi.clientSecret);
};
