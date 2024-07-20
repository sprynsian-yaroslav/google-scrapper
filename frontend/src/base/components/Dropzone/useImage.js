import React, { useCallback, useState } from "react";
import { useField } from "formik";

export const useImage = (maxImagesCount) => {
  const [isOpenUploadModal, setIsOpenUploadModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [field, , { setValue }] = useField({ name: "file" });

  const selectedImages = field.value;

  const setSelectedImages = useCallback((setter) => {
    return setValue(typeof setter === "function" ? setter(selectedImages) : setter)
  }, [selectedImages, setValue]);

  const updateImagesWithDelay = setSelectedImages;

  const onOpenUploadModal = useCallback(() => {
    setIsOpenUploadModal(true);
  }, [setIsOpenUploadModal]);

  const onCloseUploadModal = useCallback(() => {
    setIsOpenUploadModal(false);
  }, [setIsOpenUploadModal]);

  const onSave = useCallback(() => {
    onCloseUploadModal();
  }, [onCloseUploadModal]);

  const setImages = useCallback(
    (file) => {
      updateImagesWithDelay((prevState) => {
        if (prevState?.length <= maxImagesCount - 1) {
          onCloseUploadModal();
          return [{ file, preview: URL.createObjectURL(file) }];
        } else {
          return [{ file, preview: URL.createObjectURL(file) }];
        }
      });
    },
    [updateImagesWithDelay, onCloseUploadModal]
  );

  const onEditImage = useCallback(
    (index) => {
      setIsOpenEditModal(true);
      setSelectedImage({
        ...selectedImages[index].file,
        preview: selectedImages[index].preview,
        index,
      });
    },
    [setIsOpenEditModal, setSelectedImage, selectedImages]
  );

  const onCropImage = useCallback(
    (croppedImage) => {
      const selectedImagesArray = [...selectedImages];
      selectedImagesArray[selectedImage?.index] = {
        file: croppedImage,
        name: selectedImage?.path,
        preview: URL.createObjectURL(croppedImage),
      };
      setSelectedImages(selectedImagesArray);
      setIsOpenEditModal(false);
    },
    [setSelectedImages, selectedImage]
  );

  const onCloseEditModal = useCallback(() => {
    setIsOpenEditModal(false);
    setSelectedImages([])
  }, [setIsOpenEditModal, setSelectedImages]);

  const onDeleteImage = useCallback(
    (index) => {
      const selectedImagesArray = [...selectedImages];
      selectedImagesArray.splice(index, 1);
      setSelectedImages(selectedImagesArray);
    },
    [setSelectedImages, selectedImages]
  );

  const clearAll = useCallback(() => {
    setSelectedImages([]);
  }, []);

  return {
    selectedImages,
    isOpenUploadModal,
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
    setSelectedImages,
    clearAll,
    field
  };
};
