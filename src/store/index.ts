import { configureStore, createSlice } from '@reduxjs/toolkit';
import { IDayItem, ISelectedDate, IUserInfo } from '../interfaces';

const month: number = 0;
const year: number = 0;
const selectedDate: ISelectedDate = {
  full: '',
  formate: '',
};
const selectedMonth: IDayItem[] = [];

const isLoading: boolean = false;

const currentUserInfo: IUserInfo = {
  uid: '',
  name: '',
  phone: '',
  instagram: '',
  privateKey: '',
}

const AppStore = createSlice({
  name: 'AppStore',

  initialState: {
    month,
    year,
    selectedDate,
    selectedMonth,
    isLoading,
    currentUserInfo,
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

    setCurrentUserInfo(state, action: { payload: IUserInfo }) {
      state.currentUserInfo = action.payload;
    },

    resetCurrentUserInfo(state) {
      state.currentUserInfo = {
        uid: '',
        name: '',
        phone: '',
        instagram: '',
        privateKey: '',
      };
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