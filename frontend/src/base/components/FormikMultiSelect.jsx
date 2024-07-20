import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select'


import { useField } from 'formik';
import { FormGroup } from 'reactstrap';

const FormikMultiSelect = ({ 
  name, 
  options, 
  placeholder,
  label,
  ...props 
}) => {
  const [field, { error, touched }, helpers] = useField({ name });

  const getCurrentValue = useMemo(() => {
    return options?.find(({ value }) => value === field.value) && '';
  }, [options]);

  const handleChange = useCallback((options) => {
    const getValueOptions = options?.map(({ value }) => value);
    helpers.setValue(getValueOptions);
  }, []);

  return (
    <FormGroup className='mb-3'>
      {label && (
        <label htmlFor={props.name}
        className={classNames({'text-danger': (error && touched)})}
      >
        {label}</label>
      )} 
      <Select 
        isMulti={true}
        options={options}
        value={getCurrentValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </FormGroup>
  )
};

FormikMultiSelect.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
}

export default FormikMultiSelect;