import axios from 'axios';
import { IDayItem } from '../../interfaces';

const GLITCH_URL = 'https://verbose-remarkable-lumber.glitch.me';
const CYCLIC_URL = 'https://calendar-api.cyclic.app'

export const getMonth = async (selMonth: number, selYear: number) => {
  const query: {
    data: {
      calendarDays: IDayItem[],
      month: number,
      year: number,
    }
  } = await axios.get(GLITCH_URL, {
    params: {
      month: selMonth,
      year: selYear
    },
  });
  return query.data;
};
