import axios from 'axios';
import { IDayItem } from '../../interfaces';
export const getMonth = async (selMonth: number, selYear: number) => {
  const query: {
    data: {
      calendarDays: IDayItem[],
      month: number,
      year: number,
    }
  } = await axios.get('https://calendar-api.cyclic.app', {
    params: {
      month: selMonth,
      year: selYear
    },
  });
  return query.data;
};
