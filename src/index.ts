import 'dotenv/config';
import { body, query, validationResult } from 'express-validator';
import express from 'express';
import mongoose from 'mongoose';
import { MONGODB_URL_LOCAL } from '../util/secret';
import bcrypt from 'bcrypt';
const userSchema = require('../src/models/userModels');
const jwt = require('jsonwebtoken');

const { connection } = mongoose;
const routeApi = process.env.ROUTE_API;
const port = 8181;

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URL_LOCAL);
connection.on('connected', async () => {
  const users = await userSchema.find();
  const user = await userSchema.findOne({ email: 'lotus@gmail.com' });
  // const checkUser = user.map((data: any) => String(data.email) === 'lephuockha@gmail.com');
  // console.log(checkUser.includes(true) === false, 'sai');
  const hashPassword = bcrypt.hashSync('lotus@123', 10);
  // console.log(hash);
  // console.log(bcrypt.compareSync('le', hash), 'kha');

  if (!users.length || user === null) {
    await userSchema.create({
      firstName: 'Lotus',
      lastName: 'Dev',
      email: 'lotus@gmail.com',
      password: hashPassword,
    });
  } else {
    console.log('error');
  }
  console.log('Mongo Connection Established');
});
connection.on('reconnected', () => {
  console.log('Mongo Connection Reestablished');
});
connection.on('disconnected', () => {
  console.log('Mongo Connection Disconnected');
  console.log('Trying to reconnect to Mongo ...');
  setTimeout(() => {
    mongoose.connect(MONGODB_URL_LOCAL, {
      keepAlive: true,
      socketTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
  }, 3000);
});
connection.on('close', () => {
  console.log('Mongo Connection Closed');
});
connection.on('error', (error: Error) => {
  console.log('Mongo Connection ERROR: ' + error);
});

const app = express();
app.use(express.json());

app.use(`/${routeApi}/test`, (req, res) => {
  res.status(200);
  res.send({
    message: 'OK',
    url: MONGODB_URL_LOCAL,
  });
});

app.get(`/${routeApi}/user`, async (req, res) => {
  const user = await userSchema.find();
  res.status(200);
  res.send({
    message: 'get User',
    url: MONGODB_URL_LOCAL,
    user: user,
  });
});

app.post(
  `/${routeApi}/user`,
  body('email').isEmail().isString(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: 'Invalid email' });
    }
    const { email, password } = req.body;
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
            },
            process.env.CHECK_TOKEN,
            { expiresIn: '1h' },
          );

          res.status(200).send({
            message: 'succes',
            Token: older_token,
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
      res.status(400).send({
        message: 'System error please try again in a moment',
      });
    }
  },
);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
