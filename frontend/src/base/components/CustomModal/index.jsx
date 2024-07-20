import React from "react";
import { Modal, ModalFooter } from "reactstrap";
import PropTypes from "prop-types";
import Icon from "../Icon";
import joinClassNames from "../../helpers/joinClassNames";

export const ModalBody = ({ className, children }) => (<div className={joinClassNames("modal-body", className)}>{children}</div>);

ModalBody.propTypes = {
  children: PropTypes.any,
};

export const ModalHeader = ({ onClose, children, className, sectionClassName }) => (
  <div className={joinClassNames(sectionClassName, "modal-header d-flex justify-content-between align-items-center")}>
    <h5 className={joinClassNames(className, "modal-title mt-0")} id="myModalLabel">
      {children}
    </h5>
    <Icon icon="close" onClick={onClose} className="cursor-pointer"/>
  </div>
);

ModalHeader.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.any,
};

export const CustomModal = ({ isOpen, className, children, toggle = () => {}, size, scrollable = undefined, customHeight = undefined }) => {
  return (
    <Modal scrollable={scrollable} isOpen={isOpen} size={size ? size: "md"} centered className={className} toggle={toggle}>
      {children}
    </Modal>
  );
};

CustomModal.propTypes = {
  children: PropTypes.any,
  isOpen: PropTypes.bool,
};

export const ModalActions = ({ children }) => {
  return (
    <ModalFooter>
      {children}
    </ModalFooter>
  )
}