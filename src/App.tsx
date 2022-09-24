import AppRouter from "./AppRouter";
import { setLoading, setMonth, setSelectedMonth, setYear } from "./store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect } from 'react';
import BGContainer from "./components/BGContainer/BGContainer";
import Spiner from "./components/Spiner/Spiner";
import { IDayItem } from "./interfaces";
import axios from 'axios';
import { getMonth } from "./screens/Calendar/CalendarService";

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

  return (
    <div className="App">
      <Spiner />
      <BGContainer>
        <AppRouter />
      </BGContainer>
    </div>
  );
}

export default App;
