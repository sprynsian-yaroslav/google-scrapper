export const HTTPS_PATTERN = /^((http|https):\/\/s3)/;
export const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()?|]?)(?=.*\d)[\S]+$/;
export const ONLY_NUMBERS_PATTERN = /[^0-9]/g

export const URL_PATTERN = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/