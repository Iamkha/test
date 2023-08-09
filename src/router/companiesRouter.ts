import express from 'express';
import companiesModels from '../models/companiesModels';
import { securityCodeMidleWare } from '../middlewares/securityCodeMidleWare';

const router = express.Router();
router.get(`/`, securityCodeMidleWare, async (req, res) => {
  const { limit, page } = req.query;

  try {
    const data = await companiesModels
      .aggregate([
        {
          $lookup: {
            from: 'templates',
            localField: '_id',
            foreignField: 'referenceId',
            as: 'template',
          },
        },
      ])
      .limit(Number(limit) || 10)
      .skip((Number(page) - 1) * Number(limit));

    const companieslength = await companiesModels.countDocuments();

    res.status(200);
    res.send({
      data: data,
      pagination: {
        curPage: Number(page),
        lastPage: Math.ceil(Math.max(companieslength, 1) / Number(limit)),
        totalCount: companieslength || 0,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: 'System error please try again in a moment',
    });
  }
});

export default router;
