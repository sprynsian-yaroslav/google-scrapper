export const DEFAULT_DEBOUNCE_DELAY = 1000;
export const DEFAULT_TABLE_LIMIT = 10

export const RECOMMENDATIONS_FILE_TYPE = 1;
export const PROGRAMS_FILE_TYPE = 12;
export const FOODINTOLERANCE_FILE_TYPE = 8;
export const CSV_FILE_TYPE = 3;
export const EMPTY_ARRAY = [];

export const GENDERS = ["", "Male", "Female"];

export const EMPTY_FILE_SIZE = 0;
export const EMPTY_FILE_ERROR = "The file is empty.";
export const FILE_HAS_INCORRECT_STRUCTURE = "File has incorrect structure. Please, check.";

export const BYTES_IN_KILOBYTE = 1024;
export const KILOBYTES_IN_MEGABYTE = 1024;
export const MAX_DNA_CSV_FILE_SIZE = 20 * BYTES_IN_KILOBYTE * KILOBYTES_IN_MEGABYTE; // 20MB
export const ALLOWED_DNA_CSV_FILE_EXTENSION = ["csv"];
export const ERROR_DNA_CSV_FILE_SIZE_MESSAGE = `Invalid file size. Max. size ${MAX_DNA_CSV_FILE_SIZE/KILOBYTES_IN_MEGABYTE/BYTES_IN_KILOBYTE} mb`;
export const ERROR_ALLOWED_DNA_CSV_FILE_TYPE_MESSAGE = "File is not supported. Please upload a csv format file";
export const REACT_DROPZONE_INVALID_FILE_TYPE_ERROR = "file-invalid-type";
export const CSV_FILE_MASK = {
  "text/csv": [".csv"]
}

export const DNA_SCV_FILE_MANDATORY_COLUMNS = [
  "SID",
  "Sentrix_ID",
  "Sentrix_Position"
];
