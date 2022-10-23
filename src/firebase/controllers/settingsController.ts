import { addDoc, collection, deleteField, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { ITemplateTimeItem } from "../../interfaces";
import { DB } from "../firebase"

export const useSettings = () => {
  const settingsRef = collection(DB, 'settings');

  const getTimeTemplate = async () => {
    try {
      const timeSnap = await getDoc(doc(settingsRef, 'timeTemplate'));
      return timeSnap.data() as { timeList: { [key: string]: ITemplateTimeItem } };
    } catch (e) {
      console.log(e);
    }
  };

  const addTimeToTemplate = async (time: ITemplateTimeItem) => {
    try {
      await updateDoc(doc(settingsRef, 'timeTemplate'), {
        ['timeList.' + [time.id]]: time,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const deletiTimeFromTemplate = async (id: string) => {
    try {
      await updateDoc(doc(settingsRef, 'timeTemplate'), {
        ['timeList.' + [id]]: deleteField(),
      });
    } catch (e) {
      console.log(e);
    }
  };

  return {
    getTimeTemplate,
    addTimeToTemplate,
    deletiTimeFromTemplate,
  }
};
