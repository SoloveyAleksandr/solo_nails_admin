import { collection, doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { setSelectedDay } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { DB } from "../firebase";
import { Day, dayConverter, sortTimesList } from "../services/dayService";

export default function useDay() {
  const appState = useAppSelector(s => s.AppStore);
  const reduxDispatch = useAppDispatch();

  const dayRef = collection(DB, 'day');

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

  const addDay = async (date: {
    full: string,
    formate: string
  }) => {
    try {
      await setDoc(doc(dayRef, date.full), { ...new Day(date) });
    } catch (e) {
      errorHandler(e);
    }
  };

  const getDay = async () => {
    try {
      const fullDate = appState.selectedDate.full;
      const formateDate = appState.selectedDate.formate;
      const daySnap = await getDoc(doc(dayRef, fullDate).withConverter(dayConverter));
      if (daySnap.exists()) {
        reduxDispatch(setSelectedDay(daySnap.data()));
      } else {
        await addDay({
          full: fullDate,
          formate: formateDate,
        });
        await getDay();
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  return {
    getDay,
  }
}