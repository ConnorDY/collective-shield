import moment from 'moment';

export const FormatDate = (date: Date, format = 'DD/MM/YY') =>
  moment(date).format(format);
