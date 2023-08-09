import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userSchema from '../models/userModels';
import { checkRoleUser, getTokenMiddleware } from '../middlewares/userMiddleWares';
import { securityCodeMidleWare } from '../middlewares/securityCodeMidleWare';

const router = express.Router();
router.get(`/all-user`, securityCodeMidleWare, async (req, res) => {
  const { limit, page } = req.query;

  try {
    const user = await userSchema
      .find()
      .limit(Number(limit) || 10)
      .skip((Number(page) - 1) * Number(limit));

    const userLenght = await userSchema.countDocuments();
    res.status(200);
    res.send({
      message: 'get ALl User',
      user: user,
      pagination: {
        curPage: Number(page),
        lastPage: Math.ceil(Math.max(userLenght, 1) / Number(limit)),
        totalCount: userLenght || 0,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: 'System error please try again in a moment',
    });
  }
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
        const older_token = jwt.sign(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            created_at: user.created_at,
            updated_at: user.updated_at,
            role: user.role,
          },
          process.env.CHECK_TOKEN,
          { expiresIn: 60 * 60 * 24 * 30 },
        );
        res.status(200).send({
          message: 'succes',
          token: older_token,
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
          role: role === undefined || [] ? ['user'] : role,
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

router.delete('/:id', getTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  const userDelete = await userSchema.findOne({ _id: id });
  const { email, firstName, lastName, role } = jwt.decode(
    req.headers['authorization'].split(' ')[1],
    process.env.CHECK_TOKEN,
  );

  if (
    userDelete !== null &&
    role !== null &&
    userDelete?.email !== email &&
    checkRoleUser(role) > checkRoleUser(userDelete.role)
  ) {
    await userSchema
      .findByIdAndDelete(id)
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: 'The system crashed, please try again in a moment',
        });
      })
      .then(() => {
        return res.status(200).json({
          success: true,
          message: 'You have successfully deleted the user',
        });
      });
  } else {
    return res.status(400).json({
      message: 'You are not authorized to delete this user',
    });
  }
});

router.put('/:id', getTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  const { email, firstName, lastName, created_at, updated_at, role } = req.body;
  const userEdit = await userSchema.findOne({ _id: id });
  const user = jwt.decode(req.headers['authorization'].split(' ')[1], process.env.CHECK_TOKEN);
  console.log(user);

  if (
    userEdit !== null &&
    user !== null &&
    checkRoleUser(role) <= checkRoleUser(user.role) &&
    (checkRoleUser(user.role) > checkRoleUser(userEdit.role) || user.email === userEdit.email)
  ) {
    const userAlready = await userSchema.findOne({ email });
    if (userAlready.email !== userEdit.email && userAlready) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    } else {
      await userSchema
        .findByIdAndUpdate(id, {
          email,
          firstName,
          lastName,
          role,
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: 'The system crashed, please try again in a moment',
          });
        })
        .then(() => {
          return res.status(200).json({
            success: true,
            message: 'You have successfully edit the user',
          });
        });
    }
  } else {
    return res.status(400).json({
      message: 'You are not authorized to edit this user',
    });
  }
});

export default router;
