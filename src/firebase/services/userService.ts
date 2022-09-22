import { v4 } from "uuid";
import { IHistoryItem, ITimeItem, IUser } from "../../interfaces";

export class User {
  uid: string;
  instagram: string;
  email: string;
  name: string;
  phone: string;
  privateKey: string;
  refferals: string[];
  history: {
    [key: string]: IHistoryItem
  };
  description: string;
  isAdmin: boolean;
  constructor(uid: string, instagram: string, email: string, name: string, phone: string, isAdmin: boolean) {
    this.uid = uid;
    this.instagram = instagram;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.privateKey = v4().slice(1, 7);
    this.refferals = [];
    this.isAdmin = isAdmin;
    this.description = '';
    this.history = {};
  }
}

export class UserConverter {
  uid: string;
  instagram: string;
  email: string;
  name: string;
  phone: string;
  privateKey: string;
  refferals: string[];
  history: {};
  description: string;
  isAdmin: boolean;
  constructor(user: IUser) {
    this.uid = user.uid;
    this.instagram = user.instagram;
    this.email = user.email;
    this.name = user.name;
    this.phone = user.phone;
    this.privateKey = user.privateKey;
    this.refferals = user.refferals;
    this.isAdmin = user.isAdmin;
    this.history = user.history;
    this.description = user.description;
  }
}

export const userConverter = {
  toFirestore: (user: IUser) => {
    return {
      uid: user.uid,
      email: user.email,
      name: user.name,
      phone: user.phone,
      privateKey: user.privateKey,
      refferals: user.refferals,
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
