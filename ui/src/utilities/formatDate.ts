import moment from 'moment';

export const formatDate = (date: Date, format = 'DD/MM/YY') =>
  moment(date).format(format);
