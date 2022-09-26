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
import { useToast } from '@chakra-ui/react';

function App() {
  const reduxDispatch = useAppDispatch();
  const appState = useAppSelector(state => state.AppStore);
  const toast = useToast();

  onAuthStateChanged(authentification, async (user) => {
    if (user) {
      const uid = user.uid;
      const userInfo = await
      toast({
        title: `Здравствуйте, `,
        status: 'success',
        isClosable: true,
        duration: 5000,
        position: 'top'
      });
    } else {
      toast({
        title: 'Вы вышли с аккаунта',
        status: 'success',
        isClosable: true,
        duration: 5000,
        position: 'top'
      });
    }
  });

  return (
    <ChakraProvider>
      <Spiner />
      <BGContainer>
        <AppRouter />
      </BGContainer>
    </ChakraProvider>
  );
}

export default App;
