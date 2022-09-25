import AppRouter from "./AppRouter";
import { setLoading, setMonth, setSelectedMonth, setYear } from "./store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect } from 'react';
import BGContainer from "./components/BGContainer/BGContainer";
import Spiner from "./components/Spiner/Spiner";
import { getMonth } from "./screens/Calendar/CalendarService";
import { ChakraProvider } from "@chakra-ui/react";
import { authentification } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const reduxDispatch = useAppDispatch();
  const appState = useAppSelector(state => state.AppStore);

  useEffect(() => {
    (async () => {
      reduxDispatch(setLoading(true));
      const dateInfo = await getMonth(appState.month, appState.year);
      reduxDispatch(setMonth(dateInfo.month));
      reduxDispatch(setYear(dateInfo.year));
      reduxDispatch(setSelectedMonth(dateInfo.calendarDays));
      reduxDispatch(setLoading(false));
    })()
  }, []);

  onAuthStateChanged(authentification, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
    } else {
      console.log('User is signed out');
    }
  });

  return (
    <ChakraProvider>
      <div className="App">
        <Spiner />
        <BGContainer>
          <AppRouter />
        </BGContainer>
      </div>
    </ChakraProvider>
  );
}

export default App;
