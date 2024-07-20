import React, { useCallback, useEffect } from "react";
import { FieldArray } from "formik";
import useUploadImages from "./useUploadImages";
import ImagePreview from "./Image";
import EditModal from "./CropModal";
import { useImage } from "./useImage";
import DropzoneFile from "./index";

const useImages = (maxImagesCount = 1, validateImage) => {
  const {
    selectedImages,
    isOpenEditModal,
    onOpenUploadModal,
    onCloseUploadModal,
    onSave,
    setImages,
    onEditImage,
    selectedImage,
    onCropImage,
    onCloseEditModal,
    onDeleteImage,
    clearAll,
    field,
  } = useImage(maxImagesCount);

  const uploadFiles = useUploadImages();

  const uploadImages = useCallback(
    (files) => {
      return uploadFiles(files);
    },
    [uploadFiles]
  );

  useEffect(() => {
    if (selectedImages?.length && !selectedImages[selectedImages?.length - 1].cropped) {
      onEditImage(selectedImages?.length - 1)
    }
  }, [selectedImages?.length])

  const imageContainer = (
    <>
      <ImagePreview
        selectedImages={selectedImages}
        onOpenUploadModal={onOpenUploadModal}
        onEditImage={onEditImage}
        onDelete={onDeleteImage}
      />
      {!selectedImages?.length &&
        <DropzoneFile
          onReceiveFile={setImages}
          onCloseModal={onCloseUploadModal}
          onSave={onSave}
          onValidate={validateImage}
        />
      }
      {!!selectedImages?.length && !selectedImages[0]?.originalPath &&
        <EditModal
          isOpen={isOpenEditModal}
          selectedImage={selectedImage}
          onCropImage={onCropImage}
          onClose={onCloseEditModal}
        />
      }
      <FieldArray {...field} />
    </>
  );

  return {
    selectedImages,
    clearAll,
    uploadImages,
    imageContainer,
  };
}

export const FormAvatar = ({ validateImage }) => {
  const { imageContainer } = useImages(undefined, validateImage);

  return imageContainer;
};
