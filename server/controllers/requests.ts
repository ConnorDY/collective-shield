import {
  JsonController,
  Body,
  Get,
  Param,
  Post,
  Put,
  CurrentUser,
  Authorized
} from 'routing-controllers';

import config from '../config';
import { Request } from '../schemas';
import { IRequest, IUser } from '../interfaces';

@Authorized()
@JsonController(`${config.apiPrefix}/requests`)
export default class RequestsController {
  @Get()
  getAll() {
    return Request.find()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Get('/me')
  getMine(@CurrentUser() user: IUser) {
    if (!user) {
      return undefined;
    }

    return Request.find({ userId: user._id })
      .then((results) => {
        this.sortRequestsByCreateDate(results);
        return results;
      })
      .catch((err) => {
        throw err;
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
        throw err;
      });
  }

  @Post()
  createRequest(@Body() body: IRequest) {
    return Request.create({ ...body, createDate: new Date() })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Get('/:id')
  getOneById(@Param('id') id: string) {
    return Request.findById(id)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Put('/:id')
  updateOneById(@Param('id') id: string, @Body() body: IRequest) {
    return Request.findOneAndUpdate({ _id: id }, body)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  sortRequestsByCreateDate(requests: IRequest[]) {
    requests.forEach((r) => {
      r.createDate = new Date(r.createDate!);
    });
    requests.sort((a, b) => a.createDate!.getTime() - b.createDate!.getTime());
  }
}
