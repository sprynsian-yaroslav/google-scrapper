import React, { useState, useRef, useEffect } from 'react';
import PropTypes from "prop-types";
import InputMask from 'react-input-mask';
import { noop } from "lodash";
import {
    parseDurationObjectValueToStringFormat,
    parseDurationStringFormatToObjectValue
} from "../helpers/parseDurationValue";
import { MAX_HOURS, MAX_SECONDS, MAX_MINUTES } from "../constants/duration";

const INTERVAL_DELAY = 100;

const TimeInput = ({
                       value: initialValue,
                       handleBlur = noop,
                       handleChange = noop,
                       className = '',
                       name,
                       placeholder,
                       label,
                       containerClassName,
                       errorText,
                       withoutHours = false,
                       ...other
                   }) => {

    const [value, setValue] = useState(initialValue);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const formatTime = (time) => {
        return parseDurationObjectValueToStringFormat(time, withoutHours)
    };

    const parseTime = (formattedTime) => {
        return parseDurationStringFormatToObjectValue(formattedTime, withoutHours)
    };

    const handleInputChange = (e) => {
        const newInputValue = e.target.value;
        const parsedTime = parseTime(newInputValue);
        setValue(parsedTime);
        handleChange(parsedTime);
        setTouched(true);
    };

    const incrementSeconds = () => {
        setValue(prevValue => {
            let newSeconds = (parseInt(prevValue?.seconds) || 0) + 1;
            let newMinutes = (parseInt(prevValue?.minutes) || 0);
            let newHours = withoutHours ? 0 : (parseInt(prevValue?.hours) || 0);

            if (newSeconds > MAX_SECONDS) {
                newSeconds = 0;
                newMinutes += 1;
            }

            if (newMinutes > MAX_MINUTES) {
                newMinutes = 0;
                if (!withoutHours) {
                    newHours += 1;
                }
            }

            if (newHours > MAX_HOURS) {
                newHours = 0;
            }

            const newTime = {
                hours: withoutHours ? '00' : newHours < 10 ? '0' + newHours : newHours.toString(),
                minutes: newMinutes < 10 ? '0' + newMinutes : newMinutes.toString(),
                seconds: newSeconds < 10 ? '0' + newSeconds : newSeconds.toString(),
            };

            handleChange(newTime);
            setTouched(true);
            return newTime;
        });
    };

    const decrementSeconds = () => {
        setValue(prevValue => {
            let newSeconds = (parseInt(prevValue?.seconds) || 0) - 1;
            let newMinutes = (parseInt(prevValue?.minutes) || 0);
            let newHours = withoutHours ? 0 : (parseInt(prevValue?.hours) || 0);

            if (newSeconds < 0) {
                newSeconds = MAX_SECONDS;
                newMinutes -= 1;
            }

            if (newMinutes < 0) {
                newMinutes = MAX_MINUTES;
                if (!withoutHours) {
                    newHours -= 1;
                }
            }

            if (newHours < 0) {
                newHours = MAX_HOURS;
            }

            const newTime = {
                hours: withoutHours ? '00' : newHours < 10 ? '0' + newHours : newHours.toString(),
                minutes: newMinutes < 10 ? '0' + newMinutes : newMinutes.toString(),
                seconds: newSeconds < 10 ? '0' + newSeconds : newSeconds.toString(),
            };

            handleChange(newTime);
            setTouched(true);
            return newTime;
        });
    };

    const intervalRef = useRef(null);

    const handleMouseDown = (action) => {
        action();
        intervalRef.current = setInterval(action, INTERVAL_DELAY);
    };

    const handleMouseUp = () => {
        clearInterval(intervalRef.current);
    };

    const displayValue = !touched && (!value || (withoutHours
        ? (value?.minutes === '00' && value?.seconds === '00')
        : (value?.hours === '00' && value?.minutes === '00' && value?.seconds === '00')))
        ? ''
        : formatTime(value);

    return (
        <section className={containerClassName}>
            {label && <label className={""}>{label}</label>}
            <InputMask
                mask={withoutHours ? "99m 99s" : "99h 99m 99s"}
                value={displayValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
            >
                {(inputProps) => (
                    <div className="d-flex align-items-center justify-content-between form-control">
                        <input
                            {...inputProps}
                            className={'border-0 p-0 no-focus-border w-100' + className}
                            placeholder={placeholder}
                            name={name}
                            {...other}
                            style={{
                                outline: 'none',
                            }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '5px', fontSize: '6px', color: 'inherit' }}>
                            <button
                                type="button"
                                className="border-0 p-0 m-0 bg-transparent"
                                onMouseDown={() => handleMouseDown(incrementSeconds)}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                ▲
                            </button>
                            <button
                                type="button"
                                className="border-0 p-0 m-0 bg-transparent"
                                onMouseDown={() => handleMouseDown(decrementSeconds)}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                ▼
                            </button>
                        </div>
                    </div>
                )}
            </InputMask>
            {errorText && <span className="invalid-feedback select-none">{errorText}</span>}
        </section>
    );
};

export default TimeInput;

TimeInput.propTypes = {
    value: PropTypes.shape({
        hours: PropTypes.string,
        minutes: PropTypes.string,
        seconds: PropTypes.string
    }),
    handleBlur: PropTypes.func,
    handleChange: PropTypes.func,
    className: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    containerClassName: PropTypes.string,
    errorText: PropTypes.string,
    withoutHours: PropTypes.bool,
};
