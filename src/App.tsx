import { useEffect, useRef, useState } from "react"

interface CalendarProps{
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}

function Calendar(props: CalendarProps) {

  const {
    value: propsValue,
    defaultValue,
    onChange
  } = props;

  const [value, setValue] = useState(() => {
    // 通过判断 value 是不是 undefined 来区分受控模式和非受控模式
    if (propsValue !== undefined) {
      // 首次渲染，是受控模式
      return propsValue;
    } else {
      return defaultValue;
    }
  });

  const isFirstRender = useRef(true);

  // 受控模式
  useEffect(() => {
    if(propsValue === undefined && !isFirstRender.current) {
      // 非首次渲染，受控模式
      setValue(propsValue);
    }
    isFirstRender.current = false;
  }, [propsValue]);

  // 如果是受控模式，useState 的初始值设置 props.value，然后渲染用 props.value。
  // 如果是非受控模式，那渲染用内部 state 的 value，然后 changeValue 里 setValue。
  const mergedValue = propsValue === undefined ? value : propsValue;

  function changeValue(date: Date) {
    if (propsValue === undefined) {
      // 非受控
      setValue(date);
    }
    onChange?.(date);
  }

  return <div>
    {mergedValue?.toLocaleDateString()}
    <div onClick={()=> {changeValue(new Date('2024-5-1'))}}>2023-5-1</div>
    <div onClick={()=> {changeValue(new Date('2024-5-2'))}}>2023-5-2</div>
    <div onClick={()=> {changeValue(new Date('2024-5-3'))}}>2023-5-3</div>
  </div>
}

function App() {
  return <Calendar defaultValue={new Date('2024-5-1')} onChange={(date) => {
    console.log(date.toLocaleDateString());
  }}/>
}

export default App
