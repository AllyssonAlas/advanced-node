import { TokenValidator } from '@/domain/contracts/crypto';

type Input = { token: string };
export type Authorize = (params: Input) => Promise<void>;
type Setup = (crypto: TokenValidator) => Authorize;

export const setupAuthorize: Setup = (crypto) => async (params) => {
  await crypto.validateToken(params);
};
