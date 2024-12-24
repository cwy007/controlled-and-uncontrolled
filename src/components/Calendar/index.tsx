import dayjs, { Dayjs } from "dayjs";
import MonthCalendar from "./MonthCalendar";
import Header from "./Header";
import { CSSProperties, ReactNode, useState } from "react";
import classNames from "classnames";
import LocaleContext from "./LocaleContext";
import { useControllableValue } from "ahooks";

export interface CalendarProps {
  value?: Dayjs;
  defaultValue?: Dayjs;
  onChange?: (date: Dayjs) => void;
  style?: CSSProperties;
  className?: string | string[];
  // 定制日期显示，会完全覆盖日期单元格
  dateRender?: (currentDate: Dayjs) => ReactNode;
  // 定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效。
  dateInnerContent?: (currentDate: Dayjs) => ReactNode;
  // 国际化相关
  locale?: string;
}

const Calendar = (props: CalendarProps) => {
  const { style, className, locale } = props;
  const [currValue, setCurrValue] = useControllableValue(props, {
    defaultValue: dayjs(),
  })
  // useState<Dayjs>(value);
  const [currMonth, setCurrMonth] = useState<Dayjs>(currValue);

  const clsNames = classNames("calendar", className);

  const changeDate = (date: Dayjs) => {
    setCurrValue(date);
    setCurrMonth(date);
  }

  const selectHandler = (date: Dayjs) => {
    console.log('selectHandler-->', date)
    changeDate(date);
  };

  const prevMonthHandler = () => {
    setCurrMonth(currMonth.subtract(1, "month"));
  };

  const nextMonthHandler = () => {
    setCurrMonth(currMonth.add(1, "month"));
  };

  const todayHandler = () => {
    const date = dayjs(Date.now());
    changeDate(date);
  }

  return (
    <LocaleContext.Provider
      value={{
        locale:
          locale ||
          (navigator.language === "en" ? "en-US" : navigator.language),
      }}
    >
      <div className={clsNames} style={style}>
        <Header
          currMonth={currMonth}
          prevMonthHandler={prevMonthHandler}
          nextMonthHandler={nextMonthHandler}
          todayHandler={todayHandler}
        />
        <MonthCalendar
          {...props}
          value={currValue}
          selectHandler={selectHandler}
          currMonth={currMonth}
        />
      </div>
    </LocaleContext.Provider>
  );
};

export default Calendar;
