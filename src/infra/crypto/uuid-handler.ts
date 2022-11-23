import { v4 } from 'uuid';

import { UUIDGenerator } from '@/domain/contracts/gateways';

export class UUIDHandler {
  uuid({ key }: UUIDGenerator.Input): void {
    v4();
  }
}
