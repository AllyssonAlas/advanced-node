import { AxiosHttpClient } from '@/infra/apis';

export const makeAxiosClient = (): AxiosHttpClient => {
  return new AxiosHttpClient();
};
