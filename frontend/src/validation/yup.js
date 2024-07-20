import { setLocale } from 'yup';
import * as yup from 'yup';

const DEFAULT_VALIDATION_ERROR = '{label} is required';
const MIN_NUMBER_VALIDATION_ERROR = '{label} is required';

setLocale({
    mixed: {
        required: DEFAULT_VALIDATION_ERROR,
        default: DEFAULT_VALIDATION_ERROR,
        notType: DEFAULT_VALIDATION_ERROR,
    },
    string: {
        trim: DEFAULT_VALIDATION_ERROR,
    },
});

export default yup;