import axios from 'axios';

import { HttpGetClient } from '@/infra/http';

export class AxiosHttpClient implements HttpGetClient {
  async get<T = any>({ url, params }: HttpGetClient.Input): Promise<T> {
    const output = await axios.get(url, { params });
    return output.data;
  }
}
