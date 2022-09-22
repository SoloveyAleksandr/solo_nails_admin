import AppRouter from "./AppRouter";
import { setMonth, setYear } from "./store";
import { useAppDispatch } from "./store/hooks";
import { useEffect } from 'react';
import BGContainer from "./components/BGContainer/BGContainer";
import Spiner from "./components/Spiner/Spiner";

function App() {
  const reduxDispatch = useAppDispatch();
  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    reduxDispatch(setMonth(currentMonth));
    reduxDispatch(setYear(currentYear));
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
