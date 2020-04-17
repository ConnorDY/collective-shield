import {
  JsonController,
  Body,
  Get,
  Param,
  Patch,
  Post,
  Put,
  CurrentUser,
  Authorized,
  UseBefore
} from 'routing-controllers';
import { MongooseFilterQuery } from 'mongoose';
import { celebrate, Segments } from 'celebrate';
import { omit, pick } from 'lodash';

import config from '../config';
import { Request } from '../schemas';
import { IRequest, IUser } from '../interfaces';
import { requestValidator, statusValidator } from '../validators';

@Authorized()
@JsonController(`${config.apiPrefix}/requests`)
export default class RequestsController {
  @Get('/assigned')
  getMyAssigned(@CurrentUser() user: IUser) {
    return Request.find({ makerID: user._id })
      .then((results) => {
        this.sortRequestsByCreateDate(results);
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Get('/me')
  getMyCreated(@CurrentUser() user: IUser) {
    return Request.find({ requestorID: user._id })
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

  @Get('/all')
  @Authorized(['admin'])
  getAll() {
    return Request.find()
      .populate('maker')
      .populate('requestor')
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
  getOneById(@Param('id') id: string, @CurrentUser() user: IUser) {
    return Request.findOne({
      _id: id
    })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Put('/assign/:id')
  assignMe(@Param('id') id: string, @CurrentUser() user: IUser) {
    // Require no printer to already be assigned to request
    return Request.findOneAndUpdate(
      { _id: id, makerID: undefined },
      { $set: { makerID: user._id } }
    )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Put('/unassign/:id')
  unassignMe(@Param('id') id: string, @CurrentUser() user: IUser) {
    // Require printer to already be assigned to request
    return Request.findOneAndUpdate(
      { _id: id, makerID: user._id },
      { $set: { makerID: undefined, status: 'Requested' } }
    )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Patch('/:id')
  patchOneById(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
    @Body() body: IRequest
  ) {
    // Admin can patch any field on any request.
    const query: MongooseFilterQuery<Pick<IRequest, any>> = { _id: id };
    let omitFields = [];

    // Requestor can update any field, except makerNotes
    if (!user.isSuperAdmin) {
      query.requestorID = user._id;
      omitFields = [...omitFields, 'makerNotes'];
    }

    return Request.findOneAndUpdate(
      query,
      { $set: omit(body, omitFields) }
    )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  // TODO - update to allow /maker-details to accept only necessary fields
  // https://github.com/ConnorDY/collective-shield/pull/117#issuecomment-614034590
  @Patch('/:id/maker-details')
  patchMakerNotesById(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
    @Body() body: IRequest
  ) {
    // Maker can only update makerNotes
    return Request.findOneAndUpdate(
      { _id: id, makerID: user._id },
      { $set: pick(body, ['makerNotes']) }
    )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Patch('/:id/:status')
  @UseBefore(celebrate({ [Segments.PARAMS]: statusValidator }))
  patchStatusById(
    @Param('id') id: string,
    @Param('status') status: string,
    @CurrentUser() user: IUser
  ) {
    // Printer assigned to a request (or admin) can update only the status
    const query: MongooseFilterQuery<Pick<IRequest, any>> = { _id: id };
    if (!user.isSuperAdmin) {
      query.makerID = user._id;
    }

    return Request.findOneAndUpdate(query, { $set: { status } })
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
