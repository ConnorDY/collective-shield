import { Joi } from 'celebrate';

const statusValidator = Joi.object().keys({
  id: Joi.string().required(),
  status: Joi.string()
    .valid('Requested', 'Queued', 'Printing', 'Completed', 'Shipped')
    .required(),
});

export default statusValidator;
