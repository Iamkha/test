import express from 'express';
import companiesModels from '../models/companiesModels';
import templatesModels from '../models/templatesModels';
import { securityCodeMidleWare } from '../middlewares/securityCodeMidleWare';

const router = express.Router();
router.get(`/`, securityCodeMidleWare, async (req, res) => {
  const { limit, page, min, max } = req.query;
  const skip = (Number(page) - 1) * Number(limit) || 0;

  try {
    const maxTemplatesModels = await templatesModels.countDocuments();
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
        {
          $project: {
            _id: 1,
            name: 1,
            address: 1,
            phone: 1,
            no: 1,
            name2: 1,
            createdAt: 1,
            updatedAt: 1,
            searchName: 1,
            template: {
              $size: '$template',
            },
          },
        },
        {
          $match: {
            template: {
              $gte: !!min ? Number(min) : 0,
              $lte: !!max ? Number(max) : maxTemplatesModels,
            },
          },
        },
        {
          $skip: Number(skip),
        },
      ])
      .limit(Number(limit) || 10);

    res.status(200);
    res.send({
      data: data,
      pagination: {
        curPage: Number(page),
        lastPage: Math.ceil(Math.max(data.length, 1) / Number(limit)),
        totalCount: data.length || 0,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: 'System error please try again in a moment',
    });
  }
});

export default router;
