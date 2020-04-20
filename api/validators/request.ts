import { Joi } from 'celebrate';

import { states } from '../constants';

const requestValidator = Joi.object().keys({
  maskShieldCount: Joi.number().min(1).max(10000).required(),
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
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().allow('').optional(),
  addressCity: Joi.string().required(),
  addressState: Joi.string()
    .valid(...states)
    .required(),
  addressZip: Joi.number().integer().required(),
  phone: Joi.string().required(),
  details: Joi.string().allow('').optional(),
  homePickUp: Joi.boolean().required(),
  makerNotes: Joi.string().allow('').optional()
});

export default requestValidator;
