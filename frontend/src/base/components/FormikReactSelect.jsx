import React from 'react';
import Select, { components } from "react-select";
import classnames from "classnames";

import AsyncSelect from 'react-select/async-creatable';
import joinClassNames from "../helpers/joinClassNames";
import { useField } from "formik";
import { useTranslate } from "../hooks/useTranslate";


export default function FormikReactSelect({
                                              setFieldValue,
                                              options,
                                              name,
                                              className,
                                              value,
                                              label,
                                              placeholder,
                                              valuePipe = (item) => item.value,
                                              withError,
                                              containerClassName,
                                              backendError,
                                              additionalComponents = {},
                                              isClearable,
                                              afterOnChange = () => {
                                              },
                                              disabled = false,
                                              id
                                          }) {
    const [field, { error, touched }, { setTouched }] = useField({ name });
    const [translate] = useTranslate();

    const hasError = (error && touched) || backendError;

    return (
        <section className={joinClassNames(containerClassName)}>
            {label && (
                <label
                    htmlFor={name}
                >
                    {label}
                </label>
            )}
            <Select
                options={options}
                id={id}
                name={name}
                key={name + field?.value?.label}
                onBlur={() => setTouched(true)}
                className={joinClassNames(className, hasError && "is-invalid select-invalid")}
                placeholder={placeholder}
                components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: (props) => (
                        <components.DropdownIndicator {...props}>
                            <i className={classnames(
                                'mdi mdi-chevron-down text-black pointer-events-none user-select-none',
                                { 'mdi-rotate-180': props.selectProps.menuIsOpen })}
                            />
                        </components.DropdownIndicator>
                    ),
                    ...additionalComponents
                }}
                onChange={(item) => {
                    setFieldValue(name, valuePipe(item));
                    afterOnChange(valuePipe(item));
                }}
                label={label}
                value={value || options.find(item => item.value === field.value)}
                isClearable={isClearable}
                isDisabled={disabled}
            />
            {withError &&
                <span className="invalid-feedback">{translate(error, { label })}</span>
            }
        </section>
    );
}


export const CustomAsyncReactSelect = ({
                                           setFieldValue,
                                           name,
                                           className,
                                           value,
                                           label,
                                           placeholder,
                                           valuePipe = (item) => item.value,
                                           withError,
                                           containerClassName,
                                           backendError,
                                           additionalComponents = {},
                                           isClearable,
                                           afterOnChange = () => {
                                           },
                                           promiseOptions
                                       }) => {
    const [field, { error, touched }, { setTouched }] = useField({ name });
    const [translate] = useTranslate();
    const hasError = (error && touched) || backendError;

    return (
        <section className={joinClassNames(containerClassName)}>
            {label && (
                <label
                    htmlFor={name}
                >
                    {label}
                </label>
            )}
            <AsyncSelect
                id={name}
                name={name}
                key={name + value?.label}
                onBlur={() => {
                    setTouched(true);
                }}
                className={joinClassNames(className, hasError && "is-invalid select-invalid")}
                placeholder={placeholder}
                components={{
                    IndicatorSeparator: () => null,
                    LoadingIndicator: () => null,
                    ...additionalComponents
                }}
                onChange={(item) => {
                    setFieldValue(name, valuePipe(item));
                    afterOnChange(valuePipe(item));
                }}
                label={label}
                value={value}
                isClearable={isClearable}
                cacheOptions
                defaultOptions
                loadOptions={promiseOptions}
            />
            {withError &&
                <span className="invalid-feedback">{translate(error, { label })}</span>
            }
        </section>
    );
};