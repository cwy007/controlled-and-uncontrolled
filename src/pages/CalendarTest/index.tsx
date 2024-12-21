import Calendar from '../../components/CalendarTest'

const CalendarTest = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Calendar defaultValue={new Date('2024-1-1')} />
      <Calendar defaultValue={new Date('2024-12-21')} />
    </div>
  )
}

export default CalendarTest;
