import Papa from "papaparse";
import {
  isAllowedExtension,
} from "../base/components/Dropzone";
import {
  DNA_SCV_FILE_MANDATORY_COLUMNS,
  EMPTY_FILE_ERROR, EMPTY_FILE_SIZE,
  FILE_HAS_INCORRECT_STRUCTURE,
} from "../base/constants/shared";


export const validateEmptyFile = (file) => {
  if (file?.size === EMPTY_FILE_SIZE) {
    throw new Error(EMPTY_FILE_ERROR);
  }
}

export const validateFileSize = (file, size, error) => {
  if (file?.size > size) {
    throw new Error(error);
  }
}

export const validateFileType = (file, type, error) => {
  if (!isAllowedExtension(file, type)) {
    throw new Error(error);
  }
}

export const getFileCSVHeaders = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      preview: 1,
      complete: (results) => {
        resolve(results.meta.fields);
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}

export const validateFileHeaders = (headers) => {
  const isHeadersPresent = checkIfMandatoryColumnsPresent(headers);
  if (!isHeadersPresent) {
    throw new Error(FILE_HAS_INCORRECT_STRUCTURE);
  }
}

export const checkIfMandatoryColumnsPresent = (fileColumns) => {
  for (let i = 1; i < DNA_SCV_FILE_MANDATORY_COLUMNS.length; i++) {
    if (!fileColumns.find(col => col === DNA_SCV_FILE_MANDATORY_COLUMNS[i])) {
      return false
    }
  }

  return true;
};

