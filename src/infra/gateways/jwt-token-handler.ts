import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { TokenGenerator, TokenValidator } from '@/domain/contracts/gateways';

export class JwtTokenHandler implements TokenGenerator, TokenGenerator {
  constructor(private readonly secret: string) {}

  async generate({ key, expirationInMs }: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    const expirationInSeconds = expirationInMs / 1000;
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds });
  }

  async validate({ token }: TokenValidator.Input): Promise<TokenGenerator.Output> {
    const payload = verify(token, this.secret) as JwtPayload;
    return payload.key;
  }
}
