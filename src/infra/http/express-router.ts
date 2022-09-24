import { Request, Response } from 'express';

import { Controller } from '@/application/controllers';

export class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  async adapt(req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body });
    res.status(200).json(httpResponse.data);
  }
}
