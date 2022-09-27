import { v4 } from "uuid";
import { ITimeItem } from "../../interfaces";

export class Time {
  id: string;
  isReserved: boolean;
  time: string;
  date: {
    full: string,
    formate: string
  };
  client: {
    uid: string,
    confirmed: boolean,
  };
  isOffline: {
    status: boolean,
    name: string,
    instagram: string,
    comment: string,
  }

  constructor(
    time: string,
    date: {
      full: string,
      formate: string
    },
    isOffline?: {
      status: boolean,
      name: string,
      instagram: string,
      comment: string,
    }
  ) {
    this.id = v4().slice(0, 10);
    this.isReserved = false;
    this.date = date;
    this.time = time;
    this.client = {
      uid: '',
      confirmed: false,
    };
    this.isOffline = isOffline || {
      status: false,
      name: '',
      instagram: '',
      comment: '',
    }
  }
}

export class TimeConverter {
  id: string;
  isReserved: boolean;
  time: string;
  date: {
    full: string,
    formate: string
  };
  client: {
    uid: string,
    confirmed: boolean,
  }
  isOffline: {
    status: boolean,
    name: string,
    instagram: string,
    comment: string,
  }
  constructor(time: ITimeItem) {
    this.id = time.id;
    this.isReserved = time.isReserved;
    this.date = time.date;
    this.time = time.time;
    this.client = time.client;
    this.isOffline = time.isOffline;
  }
}

export const timeConverter = {
  toFirestore: (time: ITimeItem) => {
    return {
      id: time.id,
      isReserved: time.isReserved,
      time: time.time,
      date: time.date,
      client: time.client,
      isOffline: time.isOffline
    };
  },
  fromFirestore: (snapshot: any, options: object) => {
    const data: ITimeItem = snapshot.data(options);
    return new TimeConverter(data);
  }
};