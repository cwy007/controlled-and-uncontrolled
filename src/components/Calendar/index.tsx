import { Dayjs } from "dayjs";
import MonthCalendar from "./MonthCalendar";
import Header from "./Header";
import { CSSProperties, ReactNode } from "react";
import classNames from "classnames";
import LocaleContext from "./LocaleContext";

export interface CalendarProps {
  value: Dayjs;
  style?: CSSProperties;
  className?: string | string[];
  // 定制日期显示，会完全覆盖日期单元格
  dateRender?: (currentDate: Dayjs) => ReactNode;
  // 定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效。
  dateInnerContent?: (currentDate: Dayjs) => ReactNode;
  // 国际化相关
  locale?: string;
  onChange?: (date: Dayjs) => void;
}

const Calendar = (props: CalendarProps) => {
  const {
    value,
    style,
    className,
    locale,
  } = props;

  const clsNames = classNames('calendar', className);

  return (
    <LocaleContext.Provider value={{ locale: locale || (navigator.language === 'en' ? 'en-US' : navigator.language)}}>
      <div className={clsNames} style={style}>
        <Header />
        <MonthCalendar {...props} />
      </div>
    </LocaleContext.Provider>
  );
};

export default Calendar;
