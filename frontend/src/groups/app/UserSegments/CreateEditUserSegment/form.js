import yup from "../../../../validation/yup";

import { CONDITION_TYPES, CONDITION_OPERATORS, CONDITION_RELATION_TYPES } from "../../../../base/constants/conditions";

import {
    MIN_STRING_LENGTH,
    MAX_SEGMENT_NAME_LENGTH,
    MIN_PRIORITY,
    ALLOWED_SYMBOLS_MESSAGE,
    ALLOWED_SYMBOLS_REGEX
} from "./constants";

export const initialValues = {
    fullName: "",
    priority: MIN_PRIORITY,
    conditions: {
        relationType: CONDITION_RELATION_TYPES.AND,
        rules: [{}]
    },
};

const schemaValueFields = {
    [CONDITION_TYPES.BOOLEAN]: {
        [CONDITION_OPERATORS.EQUAL]: 'valueBoolean',
        [CONDITION_OPERATORS.IS_EMPTY]: null,
    },
    [CONDITION_TYPES.TERM]: {
        [CONDITION_OPERATORS.EQUAL]: 'valueString',
        [CONDITION_OPERATORS.IS_EMPTY]: null,
        [CONDITION_OPERATORS.STARTS_WITH]: 'valueString',
        [CONDITION_OPERATORS.ENDS_WITH]: 'valueString',
        [CONDITION_OPERATORS.CONTAINS]: 'valueString',
    },
    [CONDITION_TYPES.NUMBER]: {
        [CONDITION_OPERATORS.EQUAL]: 'valueNumber',
        [CONDITION_OPERATORS.IS_EMPTY]: null,
        [CONDITION_OPERATORS.GREATER]: 'valueNumber',
        [CONDITION_OPERATORS.LESS]: 'valueNumber',
        [CONDITION_OPERATORS.BETWEEN]: ['valueFrom', 'valueTo'],
    },
    [CONDITION_TYPES.NUMBER_RANGE]: {
        [CONDITION_OPERATORS.EQUAL]: ['valueFrom', 'valueTo'],
        [CONDITION_OPERATORS.IS_EMPTY]: null,
        [CONDITION_OPERATORS.MIN_BETWEEN]: ['valueFrom', 'valueTo'],
        [CONDITION_OPERATORS.MAX_BETWEEN]: ['valueFrom', 'valueTo'],
    },
};

const ruleSchema = () => yup.object().shape({
    option: yup.object().required('Option is required'),
    operator: yup.number().required('Operator is required'),
    valueNumber: yup.mixed().when(['operator', 'option'], {
        is: (operator, option) => schemaValueFields[option?.type] &&
            schemaValueFields[option?.type][operator] === 'valueNumber',
        then: yup.number().required('Number value is required'),
        otherwise: yup.mixed().notRequired()
    }),
    valueString: yup.mixed().when(['operator', 'option'], {
        is: (operator, option) => schemaValueFields[option?.type] &&
            schemaValueFields[option?.type][operator] === 'valueString',
        then: yup.string().required('String value is required'),
        otherwise: yup.mixed().notRequired()
    }),
    valueBoolean: yup.mixed().when(['operator', 'option'], {
        is: (operator, option) => schemaValueFields[option?.type] &&
            schemaValueFields[option?.type][operator] === 'valueBoolean',
        then: yup.boolean().required('Boolean value is required'),
        otherwise: yup.mixed().notRequired()
    }),
    valueFrom: yup.mixed().when(['operator', 'option'], {
        is: (operator, option) => schemaValueFields[option?.type] &&
            Array.isArray(schemaValueFields[option?.type][operator]) &&
            schemaValueFields[option?.type][operator].includes('valueFrom'),
        then: yup.number().required('From value is required'),
        otherwise: yup.mixed().notRequired()
    }),
    valueTo: yup.mixed().when(['operator', 'option'], {
        is: (operator, option) => schemaValueFields[option?.type] &&
            Array.isArray(schemaValueFields[option?.type][operator]) &&
            schemaValueFields[option?.type][operator].includes('valueTo'),
        then: yup.number().required('To value is required'),
        otherwise: yup.mixed().notRequired()
    }),
});

const rulesSchema = () => yup.array().of(
    yup.lazy((value) => {
        if (value.relationType !== undefined) {
            return yup.object().shape({
                relationType: yup.number().required('Relation type is required'),
                rules: rulesSchema()
            });
        }
        return ruleSchema();
    })
);

export const validationSchema = yup.object().shape({
    fullName: yup.string()
        .trim()
        .min(MIN_STRING_LENGTH)
        .max(MAX_SEGMENT_NAME_LENGTH)
        .matches(ALLOWED_SYMBOLS_REGEX, ALLOWED_SYMBOLS_MESSAGE)
        .required(),
    conditions: yup.object().shape({
        relationType: yup.mixed(),
        rules: rulesSchema()
    })
});
