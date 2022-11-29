import { Router } from 'express';

import { makeSavePictureController } from '@/main/factories/controllers';
import { adaptExpressRoute as adapt } from '@/main/adapters';
import { auth } from '@/main/middlewares';

export default (router: Router): void => {
  router.delete('/users/picture', auth, adapt(makeSavePictureController()));
};
