import React from 'react';

const SelectorWrapper = ({ index, name, value, children, setFieldValue, error }) => {

    const childProps = {
        name: `${name}[${index}].option`,
        value: value,
        onChange: setFieldValue,
        error,
    };

    const content = typeof children === 'function' ? children(childProps) : children;

    return (
        <div className={`selector-wrapper w-100 selector-${name}`}>
            {content}
        </div>
    );
};

export default SelectorWrapper;
