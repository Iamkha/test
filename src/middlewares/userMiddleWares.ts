import { Response, NextFunction, Request } from 'express';

export const getTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!!req.headers['token']) {
    next();
  } else {
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
  // let max = coutArr[0];
  // for (let i = 1; i < coutArr.length; i++) {
  //   if (coutArr[i] > max) {
  //     max = coutArr[i];
  //   }
  // }
  return Math.max(...coutArr) || 1;
};
