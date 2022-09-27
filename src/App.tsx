import AppRouter from "./AppRouter";
import { resetCurrentUserInfo, setIsLogged, setLoading } from "./store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import BGContainer from "./components/BGContainer/BGContainer";
import Spiner from "./components/Spiner/Spiner";
import { ChakraProvider } from "@chakra-ui/react";
import { authentification } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from '@chakra-ui/react';
import useAuth from "./firebase/controllers/userController";
import { useEffect } from 'react';

function App() {
  const reduxDispatch = useAppDispatch();
  const appState = useAppSelector(state => state.AppStore);
  const toast = useToast();
  const { getUserInfo } = useAuth();

  onAuthStateChanged(authentification, async (user) => {
    try {
      if (user) {
        if (!appState.isLogged) {
          reduxDispatch(setIsLogged(true));
        }
      } else if (!user && appState.isLogged) {
        reduxDispatch(setIsLogged(false));
      }
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    if (appState.isLogged) {
      (async () => await getUserInfo())();
      if (appState.currentUserInfo.name &&
        appState.currentUserInfo.instagram &&
        appState.currentUserInfo.phone) {
        toast({
          title: `Здравствуйте, ${appState.currentUserInfo.name}`,
          status: 'success',
          isClosable: true,
          duration: 5000,
          position: 'top',
        });
      } else {
        toast({
          title: 'Здравствуйте, пожалуйста, заполните данные профиля',
          status: 'success',
          isClosable: true,
          duration: 30000,
          position: 'top',
        });
      }
    }
  }, [appState.isLogged]);

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
