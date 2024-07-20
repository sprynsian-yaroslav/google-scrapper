import React from "react";
import { CustomModal, ModalActions, ModalBody, ModalHeader } from "./CustomModal";
import Button from "../../base/components/Button";
import { BUTTON_COLORS } from "./Button/appearance";
import joinClassNames from "../helpers/joinClassNames";
import { Formik } from "formik";
import yup from "../../validation/yup";
import FormikTextarea from "./FormikTextarea";

export default function ConfirmPopup({
  isOpen,
  updateIsOpen,
  onSubmit,
  title,
  description,
  submitBtnText,
  className = "",
  showCancelButton = true,
  submitButtonClassName = ""
}) {
  const onClose = () => updateIsOpen(false);
  return (
    <CustomModal isOpen={isOpen} className="filter-modal">
      <ModalHeader onClose={onClose}>
        {title}
      </ModalHeader>
      <ModalBody>
        <p className={joinClassNames("w-90 mb-0", className)}>
          {description}
        </p>
      </ModalBody>
      <ModalActions>
        {showCancelButton &&
          <Button color={BUTTON_COLORS.primaryOutline} onClick={onClose} className="mb-0">
            Cancel
          </Button>
        }
        <Button color={BUTTON_COLORS.primary} onClick={() => {
          onSubmit();
          onClose();
        }} className={joinClassNames("mb-0", submitButtonClassName)}>
          {submitBtnText}
        </Button>
      </ModalActions>
    </CustomModal>
  )
}

const initialValues = {
  cancellationReason: ""
}

const validationSchema = yup.object().shape({
  cancellationReason: yup
    .string()
    .min(1, "Cancellation reason is required.")
    .trim()
    .required("Cancellation reason is required."),
});

export const ConfirmPopupWithReason = ({
  isOpen,
  updateIsOpen,
  onSubmit,
  title,
  submitBtnText,
  labelText = "Enter a reason of cancellation:"
}) => {
  const onClose = () => updateIsOpen(false);
  return (
    <CustomModal isOpen={isOpen} className="filter-modal">
      <ModalHeader onClose={onClose}>
        {title}
      </ModalHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur
        validateOnMount
        onSubmit={(values) => {
          onSubmit(values);
          onClose();
        }}
      >
        {({errors, handleSubmit}) => (
          <form className="form-horizontal" onSubmit={handleSubmit}>
            <ModalBody>

              <FormikTextarea
                id="cancellationReason"
                name="cancellationReason"
                label={labelText}
                containerClassName="margin-bottom-0"
                placeholder="Enter a reason"
                rows="1"
                type="textarea"
                maxLength={MAX_BIOMARKERS_NAME_LENGTH}
              />

            </ModalBody>
            <ModalActions>
              <Button color={BUTTON_COLORS.primaryOutline} onClick={onClose} type="button" className="mb-0">
                Cancel
              </Button>
              <Button
                color={BUTTON_COLORS.primary}
                type="submit"
                disabled={!!Object.keys(errors).length}
                className="mb-0"
              >
                {submitBtnText}
              </Button>
            </ModalActions>
          </form>
        )}
      </Formik>
    </CustomModal>
  )
}
