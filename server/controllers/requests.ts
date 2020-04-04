import {
  JsonController,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  CurrentUser,
  Authorized,
  UseBefore
} from 'routing-controllers';
import { celebrate, Segments } from 'celebrate';

import config from '../config';
import { Request } from '../schemas';
import { IRequest, IUser } from '../interfaces';
import requestValidator from '../validators/request';

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
    return Request.find({ makerID: user._id })
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
    return Request.find({ makerID: undefined })
      .then((results) => {
        this.sortRequestsByCreateDate(results);
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Post()
  @UseBefore(celebrate({ [Segments.BODY]: requestValidator }))
  createRequest(@CurrentUser() user: IUser, @Body() body: IRequest) {
    return Request.create({
      ...body,
      status: 'Requested',
      createDate: new Date(),
      requestorID: user._id
    })
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
  assignMe(@Param('id') id: string, @CurrentUser() user: IUser) {
    // Require no printer to already be assigned to request
    return Request.findOneAndUpdate({ _id: id, makerID: undefined }, { $set: { makerID: user._id } })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Delete('/:id')
  unassignMe(@Param('id') id: string, @CurrentUser() user: IUser) {
    // Require printer to already be assigned to request
    return Request.findOneAndUpdate({ _id: id, makerID: user._id }, { $set: { makerID: undefined, status: 'Requested' } })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Patch('/:id')
  patchOneById(@Param('id') id: string, @CurrentUser() user: IUser, @Body() body: IRequest) {
    // Requestor can update any field
    return Request.findOneAndUpdate({ _id: id, requestorID: user._id }, { $set: body })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Patch('/:id/:status')
  patchStatusById(@Param('id') id: string, @Param('status') status: string, @CurrentUser() user: IUser) {
    // Printer assigned to a request can update only the status
    // TODO/HELP - Need validation on status?
    return Request.findOneAndUpdate({ _id: id, makerID: user._id }, { $set: { status } })
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
