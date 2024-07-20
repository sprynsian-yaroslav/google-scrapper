import yup from "../../../../validation/yup";
import {
    USER_EMAIL,
    USER_PASSWORD
} from "../../../../validation/user";

export const validationSchema = yup.object().shape({
    email: USER_EMAIL.required(),
    password: USER_PASSWORD.required(),
});

export const initialValues = {
    email: "",
    password: "",
};
