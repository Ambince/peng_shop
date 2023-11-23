import { format, fromUnixTime } from 'date-fns';
import moment from 'moment';

export const getDateFromUnix = (unix?: number): string => {
  if (unix) {
    const date = fromUnixTime(unix);
    return format(date, 'yy-MM-dd HH:mm:ss');
  }
  return '';
};

export const getDateYyyyFromUnix = (unix?: number): string => {
  if (unix) {
    const date = fromUnixTime(unix);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }
  return '';
};

export const moment2unix = (mo: moment.Moment): number => {
  return Number(mo.format('X'));
};

export const unix2moment = (unix: number): moment.Moment => {
  return moment.unix(unix);
};

export const string2unix = (str: string): number => {
  return moment(str).unix();
};
