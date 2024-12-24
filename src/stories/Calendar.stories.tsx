import type { Meta, StoryObj } from "@storybook/react";
// import Calendar from '../../Calendar/index';
import dayjs from "dayjs";
import Calendar from "../components/Calendar";
import classNames from "classnames";

const meta = {
  title: "日历组件",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Value: Story = {
  args: {
    value: dayjs("2023-11-08"),
  },
};

export const DateRender: Story = {
  args: {
    // defaultValue: dayjs('2023-11-08'),
    dateRender(currentDate, selectedDate) {
      return (
        <div
          className={classNames({
            ["calendar-month-body-cell-date-selected"]:
              selectedDate?.format("YYYY-MM-DD") ===
              currentDate?.format("YYYY-MM-DD"),
          })}
        >
          日期{currentDate.date()}
        </div>
      );
    },
  },
};

export const DateInnerContent: Story = {
  args: {
    // defaultValue: dayjs('2023-11-08'),
    dateInnerContent(currentDate) {
      return <div>日期{currentDate.date()}</div>;
    },
  },
};

export const Locale: Story = {
  args: {
    // defaultValue: dayjs('2023-11-08'),
    locale: "en-US",
  },
};
