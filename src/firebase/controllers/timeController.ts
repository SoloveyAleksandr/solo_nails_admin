import { collection, doc, updateDoc, deleteField, setDoc, deleteDoc, getDocs, query, where, addDoc } from "firebase/firestore";
import { ITimeItem } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { DB } from "../firebase";
import useReserve from "./reserveController";
import useAuth from "./userController";

export default function useTime() {
  const reduxDispatch = useAppDispatch();
  const appState = useAppSelector(store => store.AppStore);

  const { addReserve, deleteReserve } = useReserve();

  const dayRef = collection(DB, 'day');
  const freeTimeRef = collection(DB, 'freeTime');
  const reservesRef = collection(DB, 'reserves');
  const userRef = collection(DB, "user");

  const errorHandler = (error: any) => {
    interface IError {
      code: string;
    }
    console.log(error);
    const isApiError = (x: any): x is IError => {
      return x.code ? x.code : false;
    };
    if (isApiError(error)) {
      const errorCode = error.code;
      console.log(errorCode);
    }
  };

  // глубокое обраение в объекте
  // ['timeList.' + [time.id]]: deleteField()

  // ADD TIME FUNCS
  const addTimeToDay = async (time: ITimeItem) => {
    try {
      const id = time.id;
      const date = time.date.full;
      const timeRef = doc(dayRef, date);
      await updateDoc(timeRef, {
        ['timeList.' + [id]]: time
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  const addTimeToFreeTime = async (time: ITimeItem) => {
    try {
      const id = time.id;
      const date = time.date.full;
      const timeRef = doc(freeTimeRef, date);
      await setDoc(timeRef, {
        [id]: time
      })
    } catch (e) {
      errorHandler(e);
    }
  };

  const addTimeToReserves = async (time: ITimeItem) => {
    try {
      const id = time.id;
      const date = time.date.full;
      const timeRef = doc(reservesRef, date);
      await setDoc(timeRef, {
        [id]: time
      })
    } catch (e) {
      errorHandler(e);
    }
  };

  // EDIT TIME FUNCS
  const editTimeInDay = async (time: ITimeItem) => {
    try {
      const id = time.id;
      const date = time.date.full;
      const timeRef = doc(dayRef, date);
      await updateDoc(timeRef, {
        ['timeList.' + [id]]: time
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  const editTimeInFreeTime = async (time: ITimeItem) => {
    try {
      const id = time.id;
      const date = time.date.full;
      const timeRef = doc(dayRef, date);
      await updateDoc(timeRef, {
        [id]: time
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  const editTimeInReserves = async (time: ITimeItem) => {
    try {
      const id = time.id;
      const date = time.date.full;
      const timeRef = doc(dayRef, date);
      await updateDoc(timeRef, {
        [id]: time
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  // REMOVE TIME FUNCS
  const removeTimeFromDay = async (time: ITimeItem) => {
    try {
      const date = time.date.full;
      const timeRef = doc(dayRef, date);
      await updateDoc(timeRef, {
        ['timeList.' + [time.id]]: deleteField()
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  const removeTimeFromFreeTime = async (time: ITimeItem) => {
    try {
      const date = time.date.full;
      const timeRef = doc(freeTimeRef, date);
      await updateDoc(timeRef, {
        [time.id]: deleteField()
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  const removeTimeFromReserves = async (time: ITimeItem) => {
    try {
      const date = time.date.full;
      const timeRef = doc(reservesRef, date);
      await updateDoc(timeRef, {
        [time.id]: deleteField()
      });
    } catch (e) {
      errorHandler(e);
    }
  };

  // const bookATime = async (
  //   timeItem: ITimeItem,
  //   comment: string,
  // ) => {
  //   try {
  //     const timeRef = doc(dayRef, timeItem.date.full);
  //     await updateDoc(timeRef, {
  //       [`timeList.${timeItem.id}.client.uid`]: appState.currentUser.uid,
  //       [`timeList.${timeItem.id}.client.comment`]: comment,
  //       [`timeList.${timeItem.id}.isReserved`]: true,
  //     });
  //     await setReserve(timeItem.id, comment);
  //     await addHistoryItem(appState.currentUser.uid, timeItem);
  //   } catch (e) {
  //     errorHandler(e);
  //   }
  // }

  return {
    addTimeToDay,
    addTimeToFreeTime,
    addTimeToReserves,

    removeTimeFromDay,
    removeTimeFromFreeTime,
    removeTimeFromReserves,

    editTimeInDay,
    editTimeInFreeTime,
    editTimeInReserves,
  }
}