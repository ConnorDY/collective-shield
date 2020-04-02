import express from 'express';
import {
  JsonController,
  Body,
  Get,
  Param,
  Post,
  Put,
  Req
} from 'routing-controllers';

import config from '../config';
import { Request } from '../schemas';
import { IRequest } from '../interfaces';
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
    if (!user) {
      return undefined;
    }

    return Request.find({ userId: user._id })
      .then((results) => {
        this.sortRequestsByCreateDate(results);
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
        this.sortRequestsByCreateDate(results);
        return results;
      })
      .catch((err) => {
        if (err) {
          console.error(err);
        }
      });
  }

  @Post()
  createRequest(@Body() body: IRequest) {
    return Request.create(body)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Get('/:id')
  getOneById(@Param('id') id: string) {
    return Request.findById(id).exec((err, result) => {
      if (err) {
        console.error(err);
      }
      return result;
    });
  }

  @Put('/:id')
  updateOneById(@Param('id') id: string, @Body() body: IRequest) {
    return Request.findOneAndUpdate({ _id: id }, body, (err, result) => {
      if (err) {
        console.error(err);
      }
      return result;
    });
  }

  sortRequestsByCreateDate(requests: IRequest[]) {
    requests.forEach((r) => {
      r.createDate = new Date(r.createDate);
    });
    requests.sort((a, b) => a.createDate.getTime() - b.createDate.getTime());
  }
}
