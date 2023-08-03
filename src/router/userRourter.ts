import express from 'express';
import bcrypt from 'bcrypt';
import userSchema from '../models/userModels';
import { getAllUserMiddleware } from '../middlewares/getAllUserMiddleWares';

const router = express.Router();
router.get(`/all-user`, getAllUserMiddleware, async (req, res) => {
  const user = await userSchema.find();
  const { limit, page } = req.query;
  const dataPatition = user.filter((arrD: any, index: number) => {
    if (index < Number(page) * Number(limit) && index > (Number(page) - 1) * Number(limit) - 1) {
      return arrD;
    }
  });
  res.status(200);
  res.send({
    message: 'get ALl User',
    user: dataPatition,
    pagination: {
      curPage: Number(page),
      lastPage: Math.ceil(Math.max(user.length, 1) / Number(limit)),
      totalCount: user.length,
    },
  });
});
router.get(`/`, async (req, res) => {
  const user = await userSchema.find();
  res.status(200);
  res.send({
    message: 'get User',
    user: user,
  });
});

router.post(`/`, async (req, res) => {
  const { email, password } = req.body;
  // if (email === '' || password === '') {
  //   return;
  // }

  try {
    const user = await userSchema.findOne({
      email,
    });
    if (!!user) {
      if (user.email === email && bcrypt.compareSync(password, user.password)) {
        // const older_token = jwt.sign(
        //   {
        //     email: user.email,
        //     firstName: user.firstName,
        //     lastName: user.lastName,
        //   },
        //   process.env.CHECK_TOKEN,
        //   { expiresIn: '1h' },
        // );
        res.status(200).send({
          message: 'succes',
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
      } else {
        res.status(400).send({
          message: 'email or password is incorrect',
        });
      }
    } else {
      res.status(400).send({
        message: 'email or password is incorrect',
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'System error please try again in a moment',
    });
  }
});

router.post(`/register`, async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  console.log(role);

  try {
    await userSchema.validate({ email, password, firstName, lastName, role });
    const user = await userSchema.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    } else {
      await userSchema
        .create({
          email: email,
          password: bcrypt.hashSync(password, 10),
          firstName: firstName,
          lastName: lastName,
          role: role === undefined ? ['user'] : role,
        })
        .then(() => {
          res.json({
            message: 'added user successfully',
          });
        })
        .catch((e: any) => {
          res.status(500).json({
            message: 'The system is crashing, please try again in a few minutes',
          });
        });
    }
  } catch (error) {
    const err = error.errors;
    const keys = Object.keys(err);
    const errorsObj = {};
    keys.map((key) => {
      errorsObj[key] = err[key].message;
    });
    return res.status(400).json({
      message: 'errors',
      errors: errorsObj,
    });
  }
});
export default router;
