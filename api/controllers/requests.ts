import {
  JsonController,
  Body,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  CurrentUser,
  Authorized,
  UseBefore
} from 'routing-controllers';
import { MongooseFilterQuery } from 'mongoose';
import { celebrate, Segments } from 'celebrate';
import { extend, get, keys, omit, pick, reduce } from 'lodash';
import XLSX from 'xlsx';

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
      .populate('product')
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
      .populate('product')
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
      .populate('product')
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
        .populate('product')
      .then((results) => {
        this.sortRequestsByCreateDate(results);
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Get('/all/export')
  @Authorized(['admin'])
  getAllExport(@Res() res: any) {
    return Request.find()
      .populate('maker')
      .populate('requestor')
        .populate('product')
      .then((results) => {
        this.sortRequestsByCreateDate(results);

        const results$ = results.map(m => {
          return {
            ...omit(m['_doc'], ['_id', 'maker', 'requestor']),
            _id: m['_doc']['_id'].toString(),
            maker: get(m, '$$populatedVirtuals.maker.email'),
            requester: get(m, '$$populatedVirtuals.maker.email'),
          }
        });
        // Reduce the cumulative keys into a single array [ 'jobRole', 'status', etc ]
        const uniqueKeys = keys(reduce(results$, extend));
        // Fill each result object with any missing keys
        const data = results$.map(r => {
          let obj = {};
          uniqueKeys.forEach((k = '') => obj[k] = '');
          obj = { ...obj, ...r };
          return obj;
        });
        // Convert the data into a workbook
        const wb = XLSX.utils.book_new();
        // Add JSON to workbook
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "export.xlsx");

        const wbout = XLSX.write(wb, {
          type: 'base64',
          bookType: "xlsx",
          bookSST: false
        });
        res.setHeader('Content-Type', 'application/octet-stream');
        return res.send(wbout);
      })
      .catch((err) => {
        throw err;
      });
  }

  @Post()
  @UseBefore(celebrate({ [Segments.BODY]: requestValidator }))
  createRequest(@CurrentUser() user: IUser, @Body() body: IRequest) {
    return Request.create(
      {
        ...body,
        status: 'Requested',
        createDate: new Date(),
        requestorID: user._id
      }
    )
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
      .populate('product')
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
      { $set: omit(body, omitFields) },
      { runValidators: true }
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
