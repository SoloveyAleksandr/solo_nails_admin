import { configureStore, createSlice } from '@reduxjs/toolkit';
import { IDayItem, ISelectedDate } from '../interfaces';

const month: number = 0;
const year: number = 0;
const selectedDate: ISelectedDate = {
  full: '',
  formate: '',
};
const selectedMonth: IDayItem[] = [];

const isLoading: boolean = false;

const AppStore = createSlice({
  name: 'AppStore',

  initialState: {
    month,
    year,
    selectedDate,
    selectedMonth,
    isLoading,
  },

  reducers: {
    setMonth(state, action: { payload: number }) {
      state.month = action.payload;
    },

    setYear(state, action: { payload: number }) {
      state.year = action.payload;
    },

    setNextMonth(state) {
      if (state.month < 12) {
        state.month = state.month + 1;
      } else {
        state.month = 1;
        state.year = state.year + 1;
      }
    },

    setPrevMonth(state) {
      if (state.month > 1) {
        state.month = state.month - 1;
      } else {
        state.month = 12;
        state.year = state.year - 1;
      }
    },

    setSelectedDate(state, action: { payload: ISelectedDate }) {
      state.selectedDate = action.payload;
    },

    setSelectedMonth(state, action: { payload: IDayItem[] }) {
      state.selectedMonth = action.payload;
    },

    setLoading(state, action: { payload: boolean }) {
      state.isLoading = action.payload;
    },

  },
});

export const {
  setMonth,
  setYear,
  setNextMonth,
  setPrevMonth,
  setSelectedDate,
  setSelectedMonth,
  setLoading,
} = AppStore.actions;

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    AppStore: AppStore.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch