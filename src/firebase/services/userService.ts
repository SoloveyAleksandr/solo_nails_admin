import { v4 } from "uuid";
import { IHistoryItem, ITimeItem, IUser, IUserInfo } from "../../interfaces";

export class User {
  info: IUserInfo;
  inviteKey: string;
  description: string;
  isAdmin: boolean;
  constructor(uid: string, phone: string) {
    this.info = {
      uid: uid,
      name: '',
      phone: phone,
      instagram: '',
      refferals: [],
      history: {},
      privateKey: v4().slice(1, 7),
    }
    this.inviteKey = '';
    this.description = '';
    this.isAdmin = false;
  }
}

export class UserConverter {
  info: IUserInfo;
  inviteKey: string;
  description: string;
  isAdmin: boolean;
  constructor(user: IUser) {
    this.info = user.info;
    this.inviteKey = user.inviteKey;
    this.isAdmin = user.isAdmin;
    this.description = user.description;
  }
}

export const userConverter = {
  toFirestore: (user: IUser) => {
    return {
      info: user.info,
      inviteKey: user.inviteKey,
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
  history: {
    [key: string]: IHistoryItem
  };
  refferals: string[];
  privateKey: string;
  constructor(info: IUserInfo) {
    this.uid = info.uid;
    this.name = info.name;
    this.phone = info.phone;
    this.instagram = info.instagram;
    this.history = info.history;
    this.refferals = info.refferals;
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
      history: info.history,
      refferals: info.refferals,
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
