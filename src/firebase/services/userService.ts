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
  constructor(uid: string, phone: string) {
    this.info = {
      uid: uid,
      name: '',
      phone: phone,
      instagram: '',
      privateKey: v4().slice(1, 7),
    }
    this.refferals = [];
    this.inviteKey = '';
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

export class UserInfoConverter {
  uid: string;
  name: string;
  phone: string;
  instagram: string;
  privateKey: string;
  constructor(info: IUserInfo) {
    this.uid = info.uid;
    this.name = info.name;
    this.phone = info.phone;
    this.instagram = info.instagram;
    this.privateKey = info.privateKey;
  }
}

export const userInfoConverter = {
  toFirestore: (info: IUserInfo) => {
    return {
      uid: info.uid,
      name: info.name,
      phone: info.phone,
      instagram: info.instagram,
      privateKey: info.privateKey,
    };
  },
  fromFirestore: (snapshot: any, options: object) => {
    const data: IUserInfo = snapshot.data(options);
    return new UserInfoConverter(data);
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
