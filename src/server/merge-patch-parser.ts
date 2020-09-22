import { Next, Request, Response } from 'restify';

const mpContentType = 'application/merge-patch+json';

export const mergePatchBodyParser = (req: Request, resp: Response, next: Next) => {
  if (req.getContentType() === mpContentType && req.method === 'PATCH') {
    try {
      (<any>req).rawBody = req.body;
      req.body = JSON.parse(req.body);
    } catch (error) {
      next(error);
    }
  }
  return next();
};
