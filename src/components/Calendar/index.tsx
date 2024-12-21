import { Dayjs } from 'dayjs'
import MonthCalendar from './MonthCalendar'

export interface CalendarProps {
  value: Dayjs;
}

const Calendar = (props: CalendarProps) => {

  return (
    <div className='calendar'>
      <MonthCalendar {...props} />
    </div>
  )
}

export default Calendar