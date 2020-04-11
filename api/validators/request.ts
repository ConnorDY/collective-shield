import { Joi } from 'celebrate';

import { states } from '../constants';

const requestValidator = Joi.object().keys({
  maskShieldCount: Joi.number().required(),
  jobRole: Joi.string()
    .valid(
      'Doctor',
      'Nurse',
      'First Responder',
      'Medical Support Staff',
      'Healthcare Worker',
      'Critical Workforce',
      'Delivery or Retail',
      'Military',
      'Other'
    )
    .required(),
  otherJobRole: Joi.string().when('jobRole', {
    is: Joi.string().valid('Other'),
    then: Joi.string().required(),
    otherwise: Joi.string().allow('').optional()
  }),
  email: Joi.string().email().required(),
  facilityName: Joi.string().allow('').optional(),
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().allow('').optional(),
  addressCity: Joi.string().required(),
  addressState: Joi.string()
    .valid(...states)
    .required(),
  addressZip: Joi.number().integer().required(),
  details: Joi.string().allow('').optional()
});

export default requestValidator;
