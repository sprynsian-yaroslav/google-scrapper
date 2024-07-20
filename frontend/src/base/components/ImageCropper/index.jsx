import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Cropper from "react-cropper";
import classnames from "classnames";
import "cropperjs/dist/cropper.css";
import { Button } from "reactstrap";

export const MIN_IMAGE_WIDTH = 400;
export const MIN_CROP_BOX_WIDTH = 72;
export const INITIAL_CROPPER_STATE = {
  ratio1: 1,
  ratio2: 1,
  zoom: 0.2,
  dragMode: "crop",
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  enable: true,
  disable: false,
  viewMode: 2,
};

const calcPixelRatio = (imageWidth, toMinWidth = MIN_IMAGE_WIDTH) => {
  return MIN_IMAGE_WIDTH * toMinWidth / imageWidth;
};

const getImageByLink = (src) => {
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject
  })
};

export const ImageCropper = ({
  selectedImage,
  onCropImage,
  onCloseCropper,
  isRoundedCropper,
}) => {
  const [state, setState] = useState(INITIAL_CROPPER_STATE);
  const cropper = useRef(null);
  const [minImageWidth, updateMinImageWidth] = useState(MIN_CROP_BOX_WIDTH);

  const cropImage = useCallback(() => {
    if (!cropper?.current?.cropper?.getCroppedCanvas()) return;

    cropper.current.cropper
      .getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      })
      .toBlob((blob) => onCropImage(blob));
  }, [onCropImage]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      src: !selectedImage ? "" : selectedImage.preview,
    }));
  }, [selectedImage]);

  useEffect(() => {
    if (selectedImage?.preview) {
      getImageByLink(selectedImage.preview)
        .then(img => {
          updateMinImageWidth(parseInt(calcPixelRatio(img.naturalWidth), 10));
        });
    }
  }, [selectedImage]);

  return (
    <>
      <div
        className={classnames("img-container position-relative mb-2", {
          "rounded-cropper": isRoundedCropper,
        })}
      >
        <Cropper
          style={{ height: MIN_IMAGE_WIDTH, width: "100%" }}
          aspectRatio={state.ratio1 / state.ratio2}
          preview=".img-preview"
          src={state.src}
          ref={cropper}
          zoomTo={state.zoom}
          dragMode={state.dragMode}
          rotateTo={state.rotate}
          scaleX={state.scaleX}
          scaleY={state.scaleY}
          enable={state.enable}
          disable={state.disable}
          viewMode={state.viewMode}
          minCropBoxWidth={minImageWidth}
          key={minImageWidth}
          center
          guides
        />
      </div>
      <div className="d-flex justify-content-end me-3 mb-3 mt-3">
        <Button
          className="btn-block waves-effect waves-light me-2"
          color="secondary"
          onClick={onCloseCropper}
        >
          Cancel
        </Button>
        <Button
          className="btn-block waves-effect waves-light"
          color="primary"
          onClick={cropImage}
        >
          Save
        </Button>
      </div>
    </>
  );
};

ImageCropper.propTypes = {
  selectedImage: PropTypes.any,
  isRoundedCropper: PropTypes.bool,
  onCropImage: PropTypes.func,
  onCloseCropper: PropTypes.func,
};
