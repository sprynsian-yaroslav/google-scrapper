import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Icon from "../Icon";

const BYTES_IN_KB = 1000;

const Image = ({
  onDelete,
  containerClassName = "",
  image,
}) => {
  const { file: { size } = {}, name = "", preview = "" } = image;
  return (
    <div className={`${containerClassName} image-wrapper d-flex`}>
      <img className="image" src={preview} alt={"uploadedImage"}/>
      <section className="d-flex justify-content-between align-items-center w-100">
        <section className="d-flex flex-column">
          <label className="text-secondary mt-1 text-truncate">{name}</label>
          <label className="font-weight-semibold mb-0">{size/BYTES_IN_KB} KB</label>
        </section>
        {onDelete && (
          <Icon icon="trashIcon" className="cursor-pointer me-2" onClick={onDelete}/>
        )}
      </section>
    </div>
  );
};

Image.propTypes = {
  path: PropTypes.string,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  containerClassName: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

const ImagePreview = ({
  selectedImages = [],
  onEditImage,
  onDelete,
}) => {
  return (
    <>
      {selectedImages.map((image, index) => (
        <Image
          image={image}
          onDelete={() => onDelete(index)}
          key={index}
        />
      ))}
    </>
  );
};

ImagePreview.propTypes = {
  selectedImages: PropTypes.array,
  onOpenUploadModal: PropTypes.func,
  onEditImage: PropTypes.func,
  onDelete: PropTypes.func,
  maxImagesCount: PropTypes.number,
  description: PropTypes.string
};

export default ImagePreview;
