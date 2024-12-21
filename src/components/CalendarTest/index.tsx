import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";
import "./index.module.scss";
import { daysOfMonth, firstDayOfMonth } from "./utils";
import classNames from "classnames";

const monthNames = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

interface CalendarProps {
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}

export interface CalendarRef {
  getDate: () => Date;
  setDate: (date: Date) => void;
}

function InternalCalendar(props: CalendarProps, ref: ForwardedRef<CalendarRef>) {
  const { defaultValue = new Date(), onChange } = props;
  const [date, setDate] = useState(defaultValue);

  useImperativeHandle(ref, () => {
    return {
      getDate() {
        return date;
      },
      setDate(newDate: Date) {
        setDate(newDate);
      }
    }
  }, [date]);

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const renderDates = () => {
    const days = [];
    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty" />);
    }

    for (let i = 1; i <= daysCount; i++) {
      const handleClick = () => {
        const currDate = new Date(date.getFullYear(), date.getMonth(), i);
        setDate(currDate);
        onChange?.(currDate);
      };
      days.push(
        <div
          key={i}
          className={classNames({
            day: true,
            selected: i === date.getDate(),
          })}
          onClick={handleClick}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <div>
          {date.getFullYear()}年{monthNames[date.getMonth()]}
        </div>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="days">
        <div className="day">日</div>
        <div className="day">一</div>
        <div className="day">二</div>
        <div className="day">三</div>
        <div className="day">四</div>
        <div className="day">五</div>
        <div className="day">六</div>

        {renderDates()}
      </div>
    </div>
  );
}

export default forwardRef<CalendarRef, CalendarProps>(InternalCalendar);;
