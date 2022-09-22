import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Calendar from "./screens/Calendar/Calendar";
import Login from "./screens/Login/Login";
import Registration from "./screens/Registration/Registration";

function AppRouter() {
  return (
    <Routes>
      <Route path="calendar" element={<Calendar />} />
      <Route path="login" element={<Login />} />
      <Route path="sign-in" element={<Registration />} />
      <Route path="/*" element={<Navigate to={'/calendar'} />}></Route>
    </Routes>
  );
};

export default AppRouter;
