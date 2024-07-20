import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useDropzone } from "react-dropzone";
import classNames from "classnames";
import { FormGroup } from "reactstrap";
import { useService } from "../../hooks/useService";
import ToasterService from "../../../services/ToastService";

export const MAX_FILE_SIZE = 10_485_760; // 10MB
export const ALLOWED_EXTENTIONS_FILE = ["png"];
export const acceptImage = "image/png";
export const ERROR_SIZE_MESSAGE = "Invalid image size. Max. 10 mb.";
export const ERROR_ALLOWED_TYPE_MESSAGE = "Invalid format. Choose a PNG image.";

export const getExtensionFile = ({ name }) => {
  return name.substring(name.lastIndexOf(".") + 1).toLowerCase();
};

export const isAllowedExtension = (file, allowedExtensions) => {
  const fileExtension = getExtensionFile(file);

  return allowedExtensions.some((allowedExtension) => {
    return fileExtension === allowedExtension;
  });
};

export const validateFile = (file) => {
  if (file?.size > MAX_FILE_SIZE) {
    return ERROR_SIZE_MESSAGE;
  }

  if (!isAllowedExtension(file, ALLOWED_EXTENTIONS_FILE)) {
    return ERROR_ALLOWED_TYPE_MESSAGE;
  }

  return null;
};

export const DropZoneCard = ({
  onDrop,
  errorMessage,
  isDropContainer = true,
  className,
  children,
  label = "",
  fileMask = acceptImage
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileMask
  });

  return (
    <FormGroup>
      <label
        className={classNames({ "text-danger": errorMessage })}
      >
        {label}
      </label>
      <div
        className={classnames(
          { [className]: !!className },
          { "dropzone-file": !className },
          { "drag-active": isDragActive },
          { "drag-danger": errorMessage }
        )}
      >
        <div {...getRootProps()}>
          <input {...getInputProps()} className={className}/>
          {isDropContainer && (
            <div className="upload-container">
              <i className="bx bxs-cloud-upload cloud"/>
              {children}
            </div>
          )}
        </div>
      </div>
    </FormGroup>
  );
};

DropZoneCard.propTypes = {
  onDrop: PropTypes.func,
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  isDropContainer: PropTypes.bool,
  children: PropTypes.string
};

const DropzoneFile = ({
  onValidate = validateFile,
  onReceiveFile,
  className,
  isDropContainer = true,
}) => {
  /**
   * @type {ToasterService}
   */
  const toastService = useService(ToasterService);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAcceptedFile = useCallback((file) => {
    try {
      const error = onValidate(file);
      if (error) {
        setErrorMessage(error);
        toastService.error(error)
        return;
      }
    } catch ({ message }) {
      toastService.error(message)
      setErrorMessage(message);
      return;
    }
    onReceiveFile(file);
  }, [onReceiveFile, onValidate, setErrorMessage]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles.length) return;
      acceptedFiles.forEach((file) => handleAcceptedFile(file));
    },
    [handleAcceptedFile]
  );

  return (
    <DropZoneCard
      onDrop={onDrop}
      errorMessage={errorMessage}
      isDropContainer={isDropContainer}
      className={className}
    >
      <section className="upload-container--section">
        <label className="upload-container--section__title">Upload an icon</label>
        <p className="upload-container--section__desc mb-0">Drop a PNG file with transparent background.</p>
        <p className="upload-container--section__desc">Max 10 Mb</p>
      </section>
    </DropZoneCard>
  );
};

DropzoneFile.propTypes = {
  onValidate: PropTypes.func,
  onReceiveFile: PropTypes.func,
  className: PropTypes.string,
  isDropContainer: PropTypes.bool,
  onCloseModal: PropTypes.func,
  onSave: PropTypes.func,
};

export default DropzoneFile;
