import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto';

export class JwtTokenHandler implements TokenGenerator, TokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken({
    key,
    expirationInMs,
  }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000;
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds });
  }

  async validateToken({ token }: TokenValidator.Params): Promise<TokenGenerator.Result> {
    const payload = verify(token, this.secret) as JwtPayload;
    return payload.key;
  }
}
