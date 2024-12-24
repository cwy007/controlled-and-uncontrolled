import { Dayjs } from "dayjs";
import "./index.module.scss";
import { useContext } from "react";
import LocaleContext from "./LocaleContext";
import allLocales from "./locale";

interface HeaderProps {
  currMonth: Dayjs;
  prevMonthHandler: () => void;
  nextMonthHandler: () => void;
  todayHandler: () => void;
}

function Header(props: HeaderProps) {
  const {
    currMonth,
    prevMonthHandler,
    nextMonthHandler,
    todayHandler,
  } = props;

  const localeContext = useContext(LocaleContext);
  const CalendarContext = allLocales[localeContext.locale];

  return (
    <div className="calendar-header">
      <div className="calendar-header-left">
        <div className="calendar-header-icon" onClick={prevMonthHandler}>&lt;</div>
        <div className="calendar-header-value">{currMonth.format(CalendarContext.formatMonth)}</div>
        <div className="calendar-header-icon" onClick={nextMonthHandler}>&gt;</div>
        <button className="calendar-header-btn" onClick={todayHandler}>今天</button>
      </div>
    </div>
  );
}

export default Header;
