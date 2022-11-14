import { RequestHandler } from 'express';

import { HttpResponse } from '@/application/helpers';

export interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>;
}

type Adapter = (middleware: Middleware) => RequestHandler;

export const adaptExpressMiddleware: Adapter = (middleware) => async (req, res, next) => {
  const { statusCode, data } = await middleware.handle({ ...req.headers });
  res.status(statusCode).json(data);
};
