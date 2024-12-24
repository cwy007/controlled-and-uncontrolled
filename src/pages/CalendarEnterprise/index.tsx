import dayjs from "dayjs";
import Calendar from "../../components/Calendar";

const CalendarEnterprise = () => {
  return (
    <div>
      {/* {dayjs('2023-11-1').daysInMonth()}
      <br/>
      {dayjs('2023-11-1').startOf('month').format('YYYY-MM-DD')}
      <br/>
      {dayjs('2023-11-1').endOf('month').format('YYYY-MM-DD')} */}

      <Calendar
        value={dayjs("2023-11-08")}
        className={"aaa"}
        // style={{ background: 'yellow' }}
        // dateRender={(value) => {
        //   return (
        //     <div>
        //       <p style={{ background: "yellowgreen", height: "350px" }}>
        //         {value.format("YYYY/MM/DD")}
        //       </p>
        //     </div>
        //   );
        // }}

        // dateInnerContent={(value) => {
        //   return (
        //     <div>
        //       <p style={{ background: "yellowgreen", height: "30px" }}>
        //         {value.format("YYYY/MM/DD")}
        //       </p>
        //     </div>
        //   );
        // }}

        locale="zh-CN"

        onChange={(date) => {
          console.log(date.format('YYYY-MM-DD'));
        }}
      />
    </div>
  );
};

export default CalendarEnterprise;
