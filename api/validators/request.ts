import { Joi } from 'celebrate';

import { states } from '../constants';

const requestValidator = Joi.object().keys({
  maskShieldCount: Joi.number().required(),
  jobRole: Joi.string()
    .valid('Doctor', 'Nurse', 'First Responder', 'Medical Support Staff')
    .required(),
  email: Joi.string().email().required(),
  facilityName: Joi.string().required(),
  addressCity: Joi.string().required(),
  addressState: Joi.string()
    .valid(...states)
    .required(),
  addressZip: Joi.number().integer().required(),
  details: Joi.string().allow('').optional()
});

export default requestValidator;
