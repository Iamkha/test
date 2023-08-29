import 'dotenv/config';
// tham chiếu thư viện
var express = require('express');
import mongoose from 'mongoose';
import { MONGODB_URL_LOCAL } from '../util/secret';
import userRouter from '../src/router/userRourter';
import searchRouter from '../src/router/searchRouter';
import companiesRouter from '../src/router/companiesRouter';
import { createUserOne } from './controllers/createUserOne';
var cors = require('cors');
var multer = require('multer');
let exec = require('child_process').exec;
const Recipe = require('muhammara').Recipe;
const path = require('path');
const { connection } = mongoose;
const routeApi = process.env.ROUTE_API;
const port = 8080;
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
app.use(cors());

app.use(`/${routeApi}/test`, (req, res) => {
  res.status(200);
  res.send({
    message: 'OK',
    url: MONGODB_URL_LOCAL,
  });
});

app.use(`/${routeApi}/user`, userRouter);
// app.use([getTokenMiddleware]);
app.use(`/${routeApi}/companies`, companiesRouter);
app.use(`/${routeApi}/search`, searchRouter);
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + '/uploads');
  },
  filename: function (req, file, callback) {
    console.log(file);

    callback(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
app.post('/upload', upload.array('files'), async (req, res) => {
  // const pdfDoc = new Recipe(`./src/data.pdf`, `./src/uploads/${req.files[0].originalname}`);
  // await pdfDoc
  //   .encrypt({
  //     userPassword: '123',
  //     ownerPassword: '123',
  //     userProtectionFlag: 4,
  //   })
  //   .endPDF();

  try {
    const cmd = `qpdf --replace-input --encrypt 12345 12345 256 --modify=none -- ./src/uploads/${req.files[0].originalname}`;

    await exec(cmd, (er) => {
      if (er) {
        console.log(er);
      } else {
        console.log('success');
      }
    });
    res.json({ message: 'File(s) uploaded successfully' });
  } catch (error) {
    res.json({ message: 'errors' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
