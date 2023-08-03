import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { MONGODB_URL_LOCAL } from '../util/secret';
import userRouter from '../src/router/userRourter';
import { createUserOne } from './controllers/createUserOne';

const { connection } = mongoose;
const routeApi = process.env.ROUTE_API;
const port = 8181;

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URL_LOCAL);
connection.on('connected', createUserOne);
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

app.use(`/${routeApi}/user`, userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
