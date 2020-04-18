import {
  JsonController,
  Body,
  Get,
  Param,
  Patch,
  Post,
  Authorized,
  UseBefore
} from 'routing-controllers';
import { celebrate, Segments } from 'celebrate';

import config from '../config';
import { Product } from '../schemas';
import { IProduct, IProductPatch } from '../interfaces';
import { productValidator, productPatchValidator } from '../validators';

@Authorized()
@JsonController(`${config.apiPrefix}/products`)
export default class RequestsController {

  @Get('/all')
  getAll() {
    return Product.find()
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Get('/:id')
  getOneById(@Param('id') id: string) {
    return Product.findOne({
      _id: id
    })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Post()
  @Authorized(['admin'])
  @UseBefore(celebrate({ [Segments.BODY]: productValidator }))
  createProduct(@Body() body: IProduct) {
    return Product.create({
      ...body,
      createDate: new Date()
    })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  @Patch('/:id')
  @Authorized(['admin'])
  @UseBefore(celebrate({ [Segments.BODY]: productPatchValidator }))
  patchProduct(
    @Param('id') id: string,
    @Body() body: IProductPatch
  ) {
    return Product.findOneAndUpdate(
      { _id: id },
      { $set: { ...body, updateDate: new Date() } }
    )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }
}
