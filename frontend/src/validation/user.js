import * as yup from 'yup';
import { MAX_PASSWORD_LENGTH } from './lengthConstants';
import { PASSWORD_PATTERN } from "../base/constants/patterns";

export const INVALID_EMAIL_MESSAGE = "Invalid email";
export const INVALID_PASSWORD_MESSAGE = "Invalid password";

export const USER_EMAIL = yup
    .string(INVALID_EMAIL_MESSAGE)
    .email(INVALID_EMAIL_MESSAGE);

export const USER_PASSWORD = yup
    .string(INVALID_PASSWORD_MESSAGE)
    .max(MAX_PASSWORD_LENGTH, INVALID_PASSWORD_MESSAGE)
    .trim(INVALID_PASSWORD_MESSAGE);

export const USER_PASSWORD_WITH_PATTERN = USER_PASSWORD.matches(PASSWORD_PATTERN, INVALID_PASSWORD_MESSAGE)