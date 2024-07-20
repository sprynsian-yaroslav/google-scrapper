import { useCallback } from "react";
import { useService } from "../../hooks/useService";
import S3Service from "../../../services/S3Service";
import { RECOMMENDATIONS_FILE_TYPE } from "../../constants/shared";

const useUploadImages = () => {
  /**
   * @type {S3Service}
   */
  const imageService = useService(S3Service);

  return useCallback(async (file, type = RECOMMENDATIONS_FILE_TYPE, abortSignal) => {
    return imageService.uploadImageFile(file, type, abortSignal)
      .then((data) => {
        return data;
      })
  }, [imageService]);
}

export default useUploadImages;
