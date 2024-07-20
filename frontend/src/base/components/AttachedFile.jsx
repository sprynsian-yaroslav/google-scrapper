import React from 'react';
import PropTypes from 'prop-types';

const AttachedFile = ({ fileName, onRemove }) => {
  if (fileName) {
    return (
      <div className='contact-attached-file'>
        <p className='mr-3'>{fileName}</p>
        <i 
          className='bx bxs-trash-alt'
          onClick={onRemove}
        ></i>
      </div>
    )
  }

  return null;  
};

AttachedFile.propTypes = {
  fileName: PropTypes.string,
  onRemove: PropTypes.func,
}

export default AttachedFile;