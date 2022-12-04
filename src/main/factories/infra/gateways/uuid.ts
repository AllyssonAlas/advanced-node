import { UUIDHandler, UniqueId } from '@/infra/gateways';

export const makeUUIDHandler = (): UUIDHandler => {
  return new UUIDHandler();
};

export const makeUniqueID = (): UniqueId => {
  return new UniqueId();
};
