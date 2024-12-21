import { useEffect, useRef } from "react";
import Calendar, { CalendarRef } from "../../components/CalendarTest";

const CalendarTest = () => {
  const calendarRef = useRef<CalendarRef>(null);

  useEffect(() => {
    console.log('-->1', calendarRef.current?.getDate().toLocaleDateString());

    setTimeout(() => {
      calendarRef.current?.setDate(new Date(2024, 11, 25));
      // console.log('-->2', calendarRef.current?.getDate().toLocaleDateString());
    }, 3000)

    setTimeout(() => {
      // calendarRef.current?.setDate(new Date(2024, 11, 25));
      console.log('-->2', calendarRef.current?.getDate().toLocaleDateString());
    }, 5000)
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Calendar
        ref={calendarRef}
        defaultValue={new Date("2024-1-1")}
        onChange={(date) => {
          console.log(date.toLocaleString());
        }}
      />
      <Calendar defaultValue={new Date("2024-12-21")} />
    </div>
  );
};

export default CalendarTest;
