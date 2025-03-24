import { useEffect, useRef, useState } from "react";
import useMergeState from "./hooks/useMergeState";
import { IconAdd } from "./components/Icon/icons/IconAdd";
import { IconEmail } from "./components/Icon/icons/IconEmail";
import { create } from "storybook/internal/theming";
import createFromIconfont from "./components/Icon/createFromIconfont";

interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}

interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}

function Calendar(props: CalendarProps) {
  const { value: propsValue, defaultValue, onChange } = props;

  const [mergedValue, setValue] = useMergeState(new Date(), {
    value: propsValue,
    defaultValue,
    onChange,
  });

  return (
    <div>
      {mergedValue?.toLocaleDateString()}
      <div
        onClick={() => {
          setValue(new Date("2024-5-1"));
        }}
      >
        2023-5-1
      </div>
      <div
        onClick={() => {
          setValue(new Date("2024-5-2"));
        }}
      >
        2023-5-2
      </div>
      <div
        onClick={() => {
          setValue(new Date("2024-5-3"));
        }}
      >
        2023-5-3
      </div>
    </div>
  );
}

const Iconfont = createFromIconfont("//at.alicdn.com/t/c/font_546173_sq3xixqx7fm.js");

function App() {
  const [value, setValue] = useState(new Date("2024-5-1"));
  // return <Calendar defaultValue={new Date('2024-5-1')} onChange={(date) => {
  //   console.log(date.toLocaleDateString());
  // }}/>
  return (
    <div>
      <Calendar
        value={value}
        onChange={(date) => {
          console.log(date.toLocaleDateString());
          setValue(date);
        }}
      />

      <div style={{ padding: "50px" }}>
        <IconAdd size="40px"></IconAdd>
        <IconEmail spin></IconEmail>
        <IconEmail style={{ color: "blue", fontSize: "50px" }}></IconEmail>

        <br />
        <Iconfont type="ncicon-color_origin" size="4em" />
      </div>
    </div>
  );
}

export default App;
