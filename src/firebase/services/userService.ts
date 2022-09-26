import { v4 } from "uuid";
import { IHistoryItem, ITimeItem, IUser, IUserInfo } from "../../interfaces";

export class User {
  info: IUserInfo;
  refferals: string[];
  inviteKey: string;
  history: {
    [key: string]: IHistoryItem
  };
  description: string;
  isAdmin: boolean;
  constructor(uid: string, name: string, phone: string, instagram: string, inviteKey: string) {
    this.info = {
      uid: uid,
      name: name,
      phone: phone,
      instagram: instagram,
      privateKey: v4().slice(1, 7),
    }
    this.refferals = [];
    this.inviteKey = inviteKey;
    this.history = {};
    this.description = '';
    this.isAdmin = false;
  }
}

export class UserConverter {
  info: IUserInfo;
  refferals: string[];
  inviteKey: string;
  history: {
    [key: string]: IHistoryItem
  };
  description: string;
  isAdmin: boolean;
  constructor(user: IUser) {
    this.info = user.info;
    this.refferals = user.refferals;
    this.inviteKey = user.inviteKey;
    this.isAdmin = user.isAdmin;
    this.history = user.history;
    this.description = user.description;
  }
}

export const userConverter = {
  toFirestore: (user: IUser) => {
    return {
      info: user.info,
      refferals: user.refferals,
      inviteKey: user.inviteKey,
      history: user.history,
      description: user.description,
      isAdmin: user.isAdmin,
    };
  },
  fromFirestore: (snapshot: any, options: object) => {
    const data: IUser = snapshot.data(options);
    return new UserConverter(data);
  }
};

export class History {
  id: string;
  time: string;
  date: {
    full: string,
    formate: string
  };
  status: 'await' | 'success' | 'canceled';
  constructor(time: ITimeItem) {
    this.id = time.id;
    this.time = time.time;
    this.date = time.date;
    this.status = 'await';
  }
}
