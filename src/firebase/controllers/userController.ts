import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { IHistoryItem, ITimeItem } from "../../interfaces";
import { useAppDispatch } from "../../store/hooks";
import { app, authentification, DB } from "../firebase";
import { History, User, userConverter } from "../services/userService";
import useReserve from "./reserveController";

export default function useAuth() {
    const reduxDispatch = useAppDispatch();
    const auth = authentification;

    const userRef = collection(DB, "user");
    const dayRef = collection(DB, 'day');

    const { deleteReserve } = useReserve();

    const errorHandler = (error: any) => {
        interface IError {
            code: string;
        }
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

    const signIn = async (email: string, pass: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);

        } catch (e) {
            errorHandler(e);
        }
    };

    const createUser = async (email: string, pass: string, passCope: string, name: string, phone: string, instagram: string) => {
        try {
            if (pass !== passCope) {
                return;
            }
            else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                const user = userCredential.user;
                const userEmail = user.email || 'email';

                const newUser = new User(user.uid, instagram, userEmail, name, phone);
                await setDoc(doc(userRef, user.uid), { ...newUser });
            }
        } catch (e) {
            errorHandler(e);
        }
    };

    const userSignOut = async () => {
        try {
            await signOut(auth);
        } catch (e) {
            errorHandler(e);
        }
    };

    const getUser = async (uid: string) => {
        try {
            const userSnap = await getDoc(doc(userRef, uid).withConverter(userConverter));
            if (userSnap.exists()) {
                return userSnap.data();
            }
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

    const setName = async (uid: string, value: string) => {
        try {
            await updateDoc(doc(userRef, uid), {
                ['name']: value,
            });
        } catch (e) {
            errorHandler(e);
        }
    };

    const setPhone = async (uid: string, value: string) => {
        try {
            await updateDoc(doc(userRef, uid), {
                ['phone']: value,
            });
        } catch (e) {
            errorHandler(e);
        }
    };

    const setEmail = async (uid: string, value: string) => {
        try {
            await updateDoc(doc(userRef, uid), {
                ['email']: value,
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


    const addHistoryItem = async (
        uid: string,
        timeItem: ITimeItem,
    ) => {
        try {
            const newHistoryItem = new History(timeItem);
            await updateDoc(doc(userRef, uid), {
                ['history.' + [newHistoryItem.id]]: { ...newHistoryItem }
            });
        } catch (e) {
            errorHandler(e);
        }
    };

    const removeHistoryItem = async (uid: string, item: IHistoryItem) => {
        try {
            const timeRef = doc(dayRef, item.date.full);
            await updateDoc(doc(userRef, uid), {
                ['history.' + [item.id]]: deleteField(),
            });
            await updateDoc(timeRef, {
                ['timeList.' + [item.id]]: deleteField()
            });
            await deleteReserve(item.id);
        } catch (e) {
            errorHandler(e);
        }
    };

    const setHictoryStatus = async (uid: string, itemID: string, status: 'canceled' | 'success' | 'await') => {
        try {
            await updateDoc(doc(userRef, uid), {
                ['history.' + [itemID] + '.status']: status
            });
        } catch (e) {
            errorHandler(e);
        }
    };

    return {
        createUser,
        signIn,
        userSignOut,
        // getCurrentUser,
        getUser,
        addHistoryItem,
        removeHistoryItem,
        setHictoryStatus,
        setDescription,
        setName,
        setEmail,
        setPhone,
        setInst,
    }
}
