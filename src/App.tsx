import { ChangeEvent } from 'react'

function App() {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  }

  return (
    <input defaultValue="guang" onChange={onChange} />
  )
}

export default App
