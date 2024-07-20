import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useField } from 'formik';
import { FormGroup } from 'reactstrap';

const FormikSelect = ({ label, containerClassName, ...props }) => {
  const [field, { error, touched }] = useField(props);

  return (
    <FormGroup className={containerClassName}>
      {label && (
        <label htmlFor={props.name}
        className={classNames({'text-danger': (error && touched)})}
      >
        {label}</label>
      )}       
      <select className='form-control' {...field} {...props} />
    </FormGroup>
  )
};

FormikSelect.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  containerClassName: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
}

export default FormikSelect;