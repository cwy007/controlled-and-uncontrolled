import dayjs from 'dayjs'
import Calendar from '../../components/Calendar'

const CalendarEnterprise = () => {
  return (
    <div>
      {dayjs('2023-11-1').daysInMonth()}
      <br/>
      {dayjs('2023-11-1').startOf('month').format('YYYY-MM-DD')}
      <br/>
      {dayjs('2023-11-1').endOf('month').format('YYYY-MM-DD')}

      <Calendar value={dayjs('2023-11-08')} />
    </div>
  )
}

export default CalendarEnterprise