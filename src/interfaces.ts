export interface IDayItem {
  date: {
    full: string,
    formate: string,
  }
  day: string,
  month: string,
  year: string,
  isWeekend: boolean,
  isPrevMonth: boolean,
  isNextMonth: boolean,
  isToday: boolean,
}

export interface IDay {
  date: {
    full: string,
    formate: string
  }
  timeList: {
    [key: string]: ITimeItem
  },
}

export interface ITimeItem {
  id: string,
  isReserved: boolean,
  time: string,
  date: {
    full: string,
    formate: string
  },
  clientUID: string,
  isOffline: {
    status: boolean,
    name: string,
    instagram: string,
    comment: string,
  }
}

export interface ISelectedDate {
  full: string,
  formate: string,
}

export interface IUserInfo {
  uid: string,
  name: string,
  phone: string,
  instagram: string,
  privateKey: string,
}

export interface IUser {
  info: IUserInfo,
  refferals: string[],
  inviteKey: string,
  history: {
    [key: string]: IHistoryItem
  },
  description: string,
  isAdmin: boolean,
}

export interface IHistoryItem {
  id: string,
  time: string,
  date: {
    full: string,
    formate: string,
  },
  status: 'await' | 'success' | 'canceled',
}

export interface ICustomWindow extends Window {
  recaptchaVerifier: any;
  hellow: any;
}