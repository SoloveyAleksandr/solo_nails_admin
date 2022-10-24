export interface IDayItem {
  date: {
    full: number,
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
    full: number,
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
    full: number,
    formate: string
  },
  client: {
    uid: string,
    confirmed: boolean,
    service?: string,
  },
  isOffline: {
    status: boolean,
    name: string,
    instagram: string,
    phoneNumber: string,
    comment: string,
  }
}

export interface ISelectedDate {
  full: number,
  formate: string,
}

export interface IUser {
  inviteKey: string,
  uid: string,
  name: string,
  phone: string,
  instagram: string,
  history: {
    [key: string]: IHistoryItem
  },
  refferals: string[],
  privateKey: string,
  description: string,
}

export interface IHistoryItem {
  id: string,
  time: ITimeItem,
  status: 'await' | 'success' | 'canceled',
}

export interface IHistoryInfo {
  date: {
    full: number,
    formate: string
  },
  time: ITimeItem,
  info: {
    cost: number,
    time: number,
    comment: string,
  }
}

export interface ICustomWindow extends Window {
  recaptchaVerifier: any;
  hellow: any;
}

export interface IReserveItem {
  date: {
    full: number,
    formate: string,
  },
  timeList: {
    [key: string]: ITimeItem
  },
}

export interface IService {
  id: string,
  title: string,
  price: string,
  isMain: boolean,
  servicesList: {
    id: string,
    value: string,
  }[],
}

export interface IUserReserve {
  id: string;
  uid: string;
  time: ITimeItem;
  isConfirmed: boolean;
}

export interface ITemplateTimeItem {
  id: string,
  time: string,
}