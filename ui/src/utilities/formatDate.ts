import moment from 'moment';

export const formatDate = (date: Date, format = 'MM/DD/YY') =>
  moment(date).format(format);
