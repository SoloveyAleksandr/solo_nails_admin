import { collection, doc, updateDoc, deleteField, setDoc, deleteDoc } from "firebase/firestore";
import { ITimeItem } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { DB } from "../firebase";
import useReserve from "./reserveController";
import useAuth from "./userController";

export default function useTime() {
  const reduxDispatch = useAppDispatch();
  const appState = useAppSelector(store => store.AppStore);

  const { addReserve, deleteReserve } = useReserve();
  const { } = useAuth();

  const dayRef = collection(DB, 'day');
  const userRef = collection(DB, "user");

  const errorHandler = (error: any) => {
    interface IError {
      code: string;
    }
    const isApiError = (x: any): x is IError => {
      return x.code ? x.code : false;
    };
    if (isApiError(error)) {
      const errorCode = error.code;
    }
  };

  const addTime = async (date: string, time: ITimeItem) => {
    try {
      const id = time.id;
      const timeRef = doc(dayRef, date);
      await updateDoc(timeRef, {
        ['timeList.' + [id]]: time
      });
      await addReserve(id, time);
    } catch (e) {
      console.log(e);
      errorHandler(e);
    }
  };

  // const removeTime = async (item: ITimeItem) => {
  //   try {
  //     const timeRef = doc(dayRef, item.date.full);
  //     await updateDoc(timeRef, {
  //       ['timeList.' + [item.id]]: deleteField()
  //     });
  //     await deleteReserve(item.id);
  //     if (item.client.uid) {
  //       await updateDoc(doc(userRef, item.client.uid), {
  //         ['history.' + [item.id]]: deleteField(),
  //       });
  //     }
  //   } catch (e) {
  //     errorHandler(e);
  //   }
  // };

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
    addTime,
  }
}