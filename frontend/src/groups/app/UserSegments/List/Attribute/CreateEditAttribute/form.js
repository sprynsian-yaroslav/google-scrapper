import yup from "../../../../../../validation/yup";


export const initialValues = {
    label: "",
    name: "",
    type: null,
    attributeCategoryId: null
};

export const validationSchema = yup.object().shape({
    label: yup.string().trim().required(),
    name: yup.string().trim().required(),
    type: yup.number().required(),
    attributeCategoryId: yup.number().required(),
});


