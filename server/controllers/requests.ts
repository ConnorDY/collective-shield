import express from 'express';
import {
  JsonController,
  // Param,
  // Body,
  Get,
  Post,
  Put,
  Req
} from 'routing-controllers';

import config from '../config';
import { Request } from '../schemas';
import { getUser } from '../utils';

@JsonController(`${config.apiPrefix}/requests`)
export default class RequestsController {
  @Get()
  async getAll() {
    try {
      return await Request.find();
    } catch (err) {
      throw err;
    }
  }

  @Get('/me')
  getMine(@Req() req: express.Request) {
    const user = getUser(req);

    if (!user || !user.makerId) {
      return [];
    }

    return Request.find({ userId: user._id })
      .then((results) => {
        results.forEach((r) => {
          r.createDate = new Date(r.createDate);
        });

        results.sort((a: any, b: any) => a.start - b.start);

        return results;
      })
      .catch((err) => {
        if (err) {
          console.error(err);
        }
      });
  }

  @Get('/open')
  getOpen() {
    return Request.find({ makerId: undefined })
      .then((results) => {
        results.forEach((r) => {
          r.createDate = new Date(r.createDate);
        });

        results.sort((a: any, b: any) => a.start - b.start);

        return results;
      })
      .catch((err) => {
        if (err) {
          console.error(err);
        }
      });
  }

  @Post()
  createRequest(@Req() req: express.Request) {
    return Request.create(req.body)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Get('/:id')
  getOneById(@Req() req: express.Request) {
    return Request.findById(req.params.id).exec((err, result) => {
      if (err) {
        console.error(err);
      }
      return result;
    });
  }

  @Put('/:id')
  updateOneById(@Req() req: express.Request) {
    return Request.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      (err, result) => {
        if (err) {
          console.error(err);
        }
        return result;
      }
    );
  }
}
