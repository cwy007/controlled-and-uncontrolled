import "./index.module.scss";
import { CalendarProps } from ".";
import { Dayjs } from "dayjs";
import classNames from "classnames";

const weekList = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

interface MonthCalendarProps extends CalendarProps {}

const getAllDays = (date: Dayjs) => {
  // const daysInMonth = date.daysInMonth();
  const startDate = date.startOf("month");
  const day = startDate.day();

  const daysInfo: Array<{ date: Dayjs; currentMonth: boolean }> = new Array(
    6 * 7
  );

  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, "day"),
      currentMonth: false,
      // .format('YYYY-MM-DD'),
    };
  }

  for (let i = day; i < daysInfo.length; i++) {
    const calcDate = startDate.add(i - day, "day");
    daysInfo[i] = {
      date: calcDate,
      currentMonth: calcDate.month() === date.month(),
      // .format('YYYY-MM-DD'),
    };
  }
  return daysInfo;
};

const renderDays = (
  days: Array<{ date: Dayjs; currentMonth: boolean }>,
  dateRender: MonthCalendarProps["dateRender"],
  dateInnerContent: MonthCalendarProps["dateInnerContent"]
) => {
  const rows = [];
  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 7; j++) {
      const item = days[i * 7 + j];
      row[j] = (
        <div
          key={`${i}_${j}`}
          className={classNames("calendar-month-body-cell", {
            "calendar-month-body-cell-current": item.currentMonth,
          })}
        >
          {/* {dateRender ? dateRender(item.date) : item.date.date()} */}
          {dateRender ? (
            dateRender(item.date)
          ) : (
            <div className="calendar-month-body-cell-date">
              <div className="calendar-month-body-cell-date-value">
                {item.date.date()}
              </div>
              <div className="calendar-month-body-cell-date-content">
                {dateInnerContent?.(item.date)}
              </div>
            </div>
          )}
        </div>
      );
    }
    rows.push(row);
  }
  return rows.map((row, index) => (
    <div className="calendar-month-body-row" key={index}>
      {row}
    </div>
  ));
};

const MonthCalendar = (props: MonthCalendarProps) => {
  const { dateRender, dateInnerContent } = props;
  const allDays = getAllDays(props.value);

  return (
    <div className="calendar-month">
      <div className="calendar-month-week-list">
        {weekList.map((week) => (
          <div className="calendar-month-week-list-item" key={week}>
            {week}
          </div>
        ))}
      </div>

      <div className="calendar-month-body">
        {renderDays(allDays, dateRender, dateInnerContent)}
      </div>
    </div>
  );
};

export default MonthCalendar;