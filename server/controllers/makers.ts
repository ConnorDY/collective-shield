import express from 'express';
import {
  JsonController,
  Get,
  Req,
  Put,
  Param,
  Body,
  OnUndefined
} from 'routing-controllers';

import config from '../config';
import { Maker } from '../schemas';
import { getUser } from '../utils';
import { IMaker } from '../interfaces';

@JsonController(`${config.apiPrefix}/makers`)
export default class MakersController {
  @Get()
  @OnUndefined(403)
  getAll(@Req() req: express.Request) {
    // only admins should be able to view the full list of makers
    const user = getUser(req);
    if (!user || !user.isSuperAdmin) {
      return undefined;
    }

    return Maker.find({})
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Get('/:id')
  getOneById(req: express.Request, res: express.Response) {
    return Maker.findById(req.params.id)
      .then((result) => {
        return res.send(result);
      })
      .catch((err) => {
        throw err;
      });
  }

  @Put('/:id')
  updateOneById(@Param('id') id: string, @Body() body: IMaker) {
    return Maker.findOneAndUpdate({ _id: id }, body)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }
}
