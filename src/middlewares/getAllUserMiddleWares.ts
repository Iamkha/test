import { Response, NextFunction, Request } from 'express';

export const getAllUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['security-code'] === process.env.SECURITY_CODE) {
    next();
  } else {
    res.status(401).send({
      message: 'Invalid security code.',
    });
  }
};
