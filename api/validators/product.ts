import { Joi } from 'celebrate';

const productKeys = {
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  imageUrl: Joi.string().allow('').optional(),
  packingUrl: Joi.string().allow('').optional(),
  modelUrl: Joi.string().allow('').optional(),
  isArchived: Joi.boolean().optional()
};

const productValidator = Joi.object().keys(productKeys);

export const productPatchValidator = Joi.object().keys({
  ...productKeys,
  name: Joi.string().optional()
});

export default productValidator;
