import React, { forwardRef } from "react";
import { BUTTON_COLORS } from "../../base/components/Button/appearance";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../base/components/Button";
import joinClassNames from "../helpers/joinClassNames";
import {
  DEFAULT_DATE_FORMAT_FOR_BACKEND,
  formatJSDate,
} from "../../base/helpers/date";
import { DateTime } from "luxon";
import {
  useLocationSource,
} from "../../base/components/Table/hooks";

export const DATE_RANGE_PRESETS_TO_DISPLAY = [
  { label: "Past day", id: 2, },
  { label: "Past week", id: 3, },
  { label: "Past month", id: 4, },
  { label: "Past 3 months", id: 5, },
  { label: "Past 6 months", id: 6, },
  { label: "Past 12 months", id: 7, },
];

export const isUpdatedTemplate = (endRangeDate) => {
  return formatJSDate(endRangeDate, DEFAULT_DATE_FORMAT_FOR_BACKEND) === DateTime.now().toFormat(DEFAULT_DATE_FORMAT_FOR_BACKEND)
}

export const DATE_RANGE_PRESETS = [
  {},
  {},
  { daysCount: 1, monthsCount: 0 },
  { daysCount: 7, monthsCount: 0 },
  { daysCount: 0, monthsCount: 1 },
  { daysCount: 0, monthsCount: 3 },
  { daysCount: 0, monthsCount: 6 },
  { daysCount: 0, monthsCount: 12 },
  {},
]

export const generateFilterProvidersParams = (names = []) => {
  const locationSource = useLocationSource();

  return {
    source: locationSource,
    alias: names,
    scope: "",
    onApplyClearScope: ["offset"],
  }
}

const CalendarContainerWithPresets = ({
  className,
  children,
  currentPreset,
  onChange,
  endDate,
  startDate,
  ...rest
}) => {
  return (
    <div className="d-flex position-relative">
      <section className="range-picker-presets">
        {DATE_RANGE_PRESETS_TO_DISPLAY.map(({ label, id }, index) => {
          const selected = id === currentPreset;
          const preset = DATE_RANGE_PRESETS[id];

          const isSelectedManually = isUpdatedTemplate(endDate) && !currentPreset &&
            DateTime.now().minus({
              days: preset.daysCount,
              months: preset.monthsCount
            }).toFormat(DEFAULT_DATE_FORMAT_FOR_BACKEND) === DateTime.fromJSDate(startDate).toFormat(DEFAULT_DATE_FORMAT_FOR_BACKEND);

          return (
            <div
              key={index}
              className={joinClassNames(
                "range-picker-presets--preset",
                (selected || isSelectedManually) && "chosen"
              )}
              onClick={() => {
                if (selected) return;
                onChange(id)
              }}
            >
              {label}
            </div>
          )
        })}
      </section>
      <CalendarContainer className={className} {...rest}>
        {children}
      </CalendarContainer>
    </div>
  );
};


export const DateRangePicker = ({
  label,
  className,
  startDate,
  endDate,
  onChange,
  yearCount = 20,
  minDate,
  withPresets,
  currentPreset,
  isHorizontal = false,
                                  withoutClear = false
}) => {

  const ExampleCustomInput = forwardRef(({ value, onClick, ...props }, ref) => {
    const formattedValue = value.replace(" - ", " to ")
    return (
      <input className="react-datepicker__input-container" onClick={onClick} ref={ref}
        value={formattedValue} {...props} />
    )
  });

  const handlePresetChange = (presetId) => {
    const { daysCount, monthsCount } = DATE_RANGE_PRESETS[presetId];
    onChange([DateTime.now().minus({
      days: daysCount,
      months: monthsCount
    }).toJSDate(), DateTime.now().toJSDate(), presetId])
  }

  return (
    <section className={joinClassNames(
      "d-flex ",
      (className && className.includes('w-') === false) && 'w-100',
      isHorizontal ? "flex-row" : "flex-column",
      className
    )}>
      {!isHorizontal && <section className="d-flex align-items-center justify-content-between w-100 mb-2">
        {label && <label className=" mb-0">{label}</label>}
        {!!(startDate || endDate) && !withoutClear &&
          <Button
            color={BUTTON_COLORS.transparent}
            onClick={() => onChange([null, null, null])}
            className="text-secondary no-border pe-0 text-nowrap my-0 py-0"
          >
            Clear
          </Button>
        }
      </section>}

      {isHorizontal && <label className="text-nowrap mb-0 me-2">{label}</label>}

      <DatePicker
        selectsRange={true}
        className="w-100 flex-grow-0 flex-shrink-0"
        popperClassName="date-range-input"
        startDate={startDate}
        endDate={endDate}
        maxDate={new Date()}
        minDate={minDate}
        showMonthDropdown
        dateFormat="dd-MM-yyyy"
        showYearDropdown
        yearDropdownItemNumber={yearCount}
        scrollableYearDropdown
        placeholderText="Select period"
        onChange={(update) => {
          onChange(update);
        }}
        customInput={<ExampleCustomInput />}
        calendarContainer={withPresets ?
          (props) => <CalendarContainerWithPresets
            {...props}
            currentPreset={currentPreset}
            onChange={handlePresetChange}
            endDate={endDate}
            startDate={startDate}
          />
          :
          undefined
        }
      />

      {isHorizontal && !withoutClear && <Button
          color={BUTTON_COLORS.transparent}
          onClick={() => onChange([null, null, null])}
          className="text-secondary no-border pe-0 text-nowrap my-0 py-0"
      >
        Clear
      </Button>}
    </section>
  )
}
