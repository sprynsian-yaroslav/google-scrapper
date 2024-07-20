import React from "react";
import {ImageCropper} from "../ImageCropper";
import PropTypes from "prop-types";
import { Row, Col, Modal } from "reactstrap";
import { ModalHeader } from "../CustomModal";

export const CustomModal = ({ title, isOpen, onClose, children }) => {
  return (
    <Row>
      <Col className="col-12">
        <Modal isOpen={isOpen} size="lg" className="wr" centered>
          <ModalHeader onClose={onClose}>
            {title}
          </ModalHeader>
          <div className="modal-body p-0">{children}</div>
        </Modal>
      </Col>
    </Row>
  );
};

CustomModal.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.any,
};


const EditModal = ({ isOpen, selectedImage, onCropImage, onClose }) => {
  return (
    <CustomModal title="Crop image" isOpen={isOpen} onClose={onClose}>
      <ImageCropper
        selectedImage={selectedImage}
        onCropImage={onCropImage}
        onCloseCropper={onClose}
        isRoundedCropper={false}
      />
    </CustomModal>
  );
};

EditModal.propTypes = {
  isOpen: PropTypes.bool,
  selectedImage: PropTypes.any,
  onCropImage: PropTypes.func,
  onClose: PropTypes.func,
};

export default EditModal;
