import AppRouter from "./AppRouter";
import { resetCurrentUserInfo, setCurrentUserInfo, setLoading } from "./store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import BGContainer from "./components/BGContainer/BGContainer";
import Spiner from "./components/Spiner/Spiner";
import { ChakraProvider } from "@chakra-ui/react";
import { authentification } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from '@chakra-ui/react';
import useAuth from "./firebase/controllers/userController";

function App() {
  const reduxDispatch = useAppDispatch();
  const appState = useAppSelector(state => state.AppStore);
  const toast = useToast();
  const { getUserInfo } = useAuth();

  onAuthStateChanged(authentification, async (user) => {
    try {
      if (user) {
        if (appState.currentUserInfo.uid !== user.uid) {
          reduxDispatch(setLoading(true));
          await getUserInfo(user);
          reduxDispatch(setLoading(false));
          if (appState.currentUserInfo.name) {
            toast({
              title: `Здравствуйте, ${appState.currentUserInfo.name}`,
              status: 'success',
              isClosable: true,
              duration: 5000,
              position: 'top',
            });
          } else {
            toast({
              title: 'Поалуйста заполните данные профиля',
              status: 'info',
              isClosable: true,
              duration: 5000,
              position: 'top',
            });
          }
        } return;
      } else {
        if (appState.currentUserInfo.uid) {
          toast({
            title: 'Вы вышли из аккаунта',
            status: 'success',
            isClosable: true,
            duration: 5000,
            position: 'top',
          });
          reduxDispatch(resetCurrentUserInfo());
          return;
        }
      }
    } catch (e) {
      console.log(e);
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
