import axios from 'axios';

import { HttpGetClient } from '@/infra/http';

jest.mock('axios');

class AxiosHttpClient {
  async get(args: HttpGetClient.Params): Promise<void> {
    await axios.get(args.url, { params: args.params });
  }
}

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient;
  let fakeAxios: jest.Mocked<typeof axios>;
  let url: string;
  let params: object;

  beforeAll(() => {
    params = { any: 'any' };
    url = 'any_url';
    fakeAxios = axios as jest.Mocked<typeof axios>;
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  describe('get', () => {
    it('Should call get with correct param', async () => {
      await sut.get({ url, params });

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});
