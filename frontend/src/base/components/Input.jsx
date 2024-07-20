import React from 'react'
import PropTypes from 'prop-types'

export default function CustomInput({
    value,
    handleBlur,
    handleChange,
    className,
    name,
    placeholder,
    ...other
}) {
    return (
        <input
            className={'form-control ' + className}
            value={value}
            name={name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            {...other}
        />
    );
}

CustomInput.propTypes = {
    value: PropTypes.string,
    handleBlur: PropTypes.func,
    handleChange: PropTypes.func,
    className: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
}
