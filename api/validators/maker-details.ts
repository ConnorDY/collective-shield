import { Joi } from 'celebrate';

import { states } from '../constants';

const makerDetailsValidator = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().allow('').optional(),
  city: Joi.string().required(),
  state: Joi.string()
    .valid(...states)
    .required(),
  zip: Joi.number().integer().required(),
  phone: Joi.string().required(),
  homePickUp: Joi.boolean().required(),
  willShip: Joi.boolean().required(),
  willDeliver: Joi.boolean().required()
});

export default makerDetailsValidator;
