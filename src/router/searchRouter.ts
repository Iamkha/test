import express from 'express';
import puppeteer from 'puppeteer';
import pdfModels from '../models/pdfModels';
const fs = require('fs');

const router = express.Router();
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    res.status(200);
    res.download(id);
  } catch (error) {
    res.status(200);
    res.send({
      mess: 'errors',
    });
  }
});

router.post('/googles', async (req, res) => {
  try {
    const { search, name } = req.body;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // set the size of the viewport, so our screenshot will have the desired size
    // await page.setViewport({
    //   width: 1280,
    //   height: 800,
    // });
    fs.mkdir(`./src/search/${name}`, (err) => {
      if (err) {
        console.error('Không thể tạo thư mục:', err);
      } else {
        console.log('Thư mục mới đã được tạo thành công.');
      }
    });
    const params = new URLSearchParams();
    params.set('q', search);
    await page.goto(`https://www.google.com/search?${params}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.screenshot({
      path: `./src/search/${name}/${search}.png`,
      fullPage: true,
    });
    // close the browser
    await browser.close();
    res.status(200);
    res.send({
      mess: 'dung',
    });
  } catch (error) {
    res.status(200);
    res.send({
      mess: 'sai',
    });
  }
});
export default router;
