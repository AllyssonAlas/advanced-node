import { Request, Response } from 'express';

import { Controller } from '@/application/controllers';

export class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  async adapt(req: Request, res: Response): Promise<void> {
    await this.controller.handle({ ...req.body });
  }
}
