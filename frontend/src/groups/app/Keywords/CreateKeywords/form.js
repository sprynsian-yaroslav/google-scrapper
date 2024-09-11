import yup from "../../../../validation/yup";


export const initialValues = {
    keyword: '',
    contextWords: '',
    excludeWords: '',
    siteFilter: '',
    searchDate: ''
};

export const validationSchema = yup.object().shape({
    keyword: yup.string().trim().required(),
    contextWords: yup.string().nullable(),
    excludeWords: yup.string().nullable(),
    siteFilter: yup.string().url('Enter a valid URL').nullable(),
    searchDate: yup.string()
        .matches(/^\d{4}$/, "Enter a valid year (YYYY)")
        .nullable(),
});


