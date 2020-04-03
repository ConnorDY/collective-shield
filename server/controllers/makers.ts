import {
  JsonController,
  Get,
  Put,
  Param,
  Body,
  Authorized
} from 'routing-controllers';

import config from '../config';
import { Maker } from '../schemas';
import { IMaker } from '../interfaces';

@JsonController(`${config.apiPrefix}/makers`)
export default class MakersController {
  @Get()
  @Authorized('admin')
  getAll() {
    return Maker.find({})
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Get('/:id')
  getOneById(@Param('id') id: string) {
    return Maker.findById(id)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Put('/:id')
  @Authorized('admin')
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
