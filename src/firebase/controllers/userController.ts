import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FBUser } from "firebase/auth";
import { collection, deleteField, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { IHistoryItem, ITimeItem, IUser } from "../../interfaces";
import { setCurrentUserInfo } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { app, authentification, DB } from "../firebase";
import { History, User, userConverter } from "../services/userService";
import useReserve from "./reserveController";

export default function useAuth() {
    const appState = useAppSelector(s => s.AppStore);
    const reduxDispatch = useAppDispatch();
    const auth = authentification;

    const userRef = collection(DB, "user");
    const dayRef = collection(DB, 'day');

    const { deleteReserve } = useReserve();

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

            if (errorCode === 'auth/user-not-found') {

            } else if (errorCode === 'auth/wrong-password') {

            } else if (errorCode === 'auth/invalid-email') {

            } else if (errorCode === 'auth/too-many-requests') {

            } else if (errorCode === 'auth/email-already-in-use') {

            } else {

            }
        }
    };

    const userSignOut = async () => {
        try {
            await signOut(auth);
        } catch (e) {
            errorHandler(e);
        }
    };

    const getCurrentUser = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userSnap = await getDoc(doc(userRef, user.uid).withConverter(userConverter));
                if (userSnap.exists()) {
                    reduxDispatch(setCurrentUserInfo(userSnap.data()));
                    return;
                } else {
                    const newUser = new User(user.uid, user.phoneNumber || '');
                    await setDoc(doc(userRef, user.uid), { ...newUser });
                    getCurrentUser();
                }
            }
        } catch (e) {
            errorHandler(e);
        }
    };

    const getAllUsers = async () => {
        try {
            const userSnap = await getDocs(userRef);
            const list: IUser[] = [];
            userSnap.forEach((el) => {
                list.push(el.data() as IUser);
            });
            return list;
        } catch (e) {
            errorHandler(e);
        }
    };

    const getUserInfo = async (uid: string) => {
        try {
            const userSnap = await getDoc(doc(userRef, uid).withConverter(userConverter));
            if (userSnap.exists()) {
                return userSnap.data();
            }
        } catch (e) {
            errorHandler(e);
        }
    };

    const setName = async (uid: string, value: string) => {
        try {
            await updateDoc(doc(userRef, uid), {
                ['name']: value,
            });
        } catch (e) {
            errorHandler(e);
        }
    };

    const setDescription = async (uid: string, value: string) => {
        try {
            await updateDoc(doc(userRef, uid), {
                ['description']: value,
            });
        } catch (e) {
            errorHandler(e);
        }
    };

    const setInst = async (uid: string, value: string) => {
        try {
            await updateDoc(doc(userRef, uid), {
                ['instagram']: value,
            });
        } catch (e) {
            errorHandler(e);
        }
    };


    const setUserHistory = async (historyItem: IHistoryItem) => {
        try {
            await updateDoc(doc(userRef, historyItem.time.client.uid), {
                ['history.' + [historyItem.id]]: historyItem,
            });
        } catch (e) {
            errorHandler(e);
        }
    };

    return {
        getUserInfo,
        getCurrentUser,
        getAllUsers,

        userSignOut,

        setName,
        setInst,
        setDescription,

        setUserHistory,
    }
}
