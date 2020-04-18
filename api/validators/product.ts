import { Joi } from 'celebrate';

const productValidator = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  imageUrl: Joi.string().allow('').optional(),
  packingUrl: Joi.string().allow('').optional(),
  modelUrl: Joi.string().allow('').optional(),
  isArchived: Joi.boolean().optional()
});

export const productPatchValidator = Joi.object().keys({
  name: Joi.string().optional(),
  description: Joi.string().allow('').optional(),
  imageUrl: Joi.string().allow('').optional(),
  packingUrl: Joi.string().allow('').optional(),
  modelUrl: Joi.string().allow('').optional(),
  isArchived: Joi.boolean().optional()
});

export default productValidator;
