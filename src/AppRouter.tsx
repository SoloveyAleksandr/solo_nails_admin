import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AllUsers from "./screens/AllUsers/AllUsers";
import Calendar from "./screens/Calendar/Calendar";
import DayScreen from "./screens/DayScreen/DayScreen";
import FreeTime from "./screens/FreeTime/FreeTime";
import HistoryScreen from "./screens/HistoryScreen/HistoryScreen";
import Login from "./screens/Login/Login";
import MyAccount from "./screens/MyAccount/MyAccount";
import ReservedScreen from "./screens/ReservedScreen/ReservedScreen";
import Services from "./screens/Services/Services";
import SettingsScreen from "./screens/SettingsScreen/SettingsScreen";
import UserScreen from "./screens/UserScreen/UserScreen";
import WaitingScreen from "./screens/WaitingScreen/WaitingScreen";
import { useAppSelector } from "./store/hooks";

function AppRouter() {
  const appState = useAppSelector(store => store.AppStore);

  if (appState.currentUserInfo.uid) {
    return (
      <Routes>
        <Route path="day" element={<DayScreen />} />
        <Route path="my-account" element={<MyAccount />} />
        <Route path="reserved" element={<ReservedScreen />} />
        <Route path="free-time" element={<FreeTime />} />
        <Route path="services" element={<Services />} />
        <Route path="waiting" element={<WaitingScreen />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="user" element={<UserScreen />} />
        <Route path="all-users" element={<AllUsers />} />
        <Route path="history" element={<HistoryScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
        <Route path="/*" element={<Navigate to={'/calendar'} />}></Route>
      </Routes>
    )
  } else {
    return (
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={<Navigate to={'/login'} />}></Route>
      </Routes>
    )
  }
};

export default AppRouter;
