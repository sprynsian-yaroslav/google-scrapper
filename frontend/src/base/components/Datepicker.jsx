import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Icon from "./Icon";
import joinClassNames from "../helpers/joinClassNames";
import { DEFAULT_DATE, DEFAULT_DATE_OUTPUT_FORMAT } from "../constants/date";

export const CustomDatePicker = ({
  date,
  onChange,
  className,
  placeholder = "Select date",
  maxDate = DEFAULT_DATE,
  dateFormat = DEFAULT_DATE_OUTPUT_FORMAT,
}) => {
  return (
    <section className={joinClassNames("position-relative", className)}>
      <DatePicker
        selected={date}
        onChange={onChange}
        maxDate={maxDate}
        dateFormat={dateFormat}
        placeholderText={placeholder}
      />
      <Icon className="react-datepicker__custom-icon" icon="datepicker"/>
    </section>
  );
};