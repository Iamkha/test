import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';

export const getTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    jwt.verify(req.headers['authorization'].split(' ')[1], process.env.CHECK_TOKEN);

    next();
  } catch (err) {
    // err
    res.status(401).send({
      message: 'token does not exist',
    });
  }
};

export const checkRoleUser = (data: Array<any>) => {
  const coutArr = data.map((data) => {
    if (data === 'superadmin') {
      return 3;
    }
    if (data === 'admin') {
      return 2;
    }
    return 1;
  });
  return Math.max(...coutArr) || 1;
};
