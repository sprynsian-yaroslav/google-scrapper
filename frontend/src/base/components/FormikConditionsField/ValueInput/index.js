import React from 'react';
import FormikReactSelect from "../../FormikReactSelect";
import { BOOLEAN_FIELD_OPTION_LABEL } from "./constants";
import FormikInput from "../../FormikInput";
import { CONDITION_OPERATORS, CONDITION_TYPES } from "../../../constants/conditions";

const BooleanValueInput = ({ item, setFieldValue, name }) => {
    const options = Object.entries(BOOLEAN_FIELD_OPTION_LABEL)
        .map(([value, label]) => ({ value, label }));

    return <FormikReactSelect
        className="w-100"
        options={options}
        name={`${name}.valueBoolean`}
        setFieldValue={setFieldValue}
    />;
};

const TextValueInput = ({ item, name }) => {
    return <FormikInput withoutErrorText className="w-100" value={item.value} name={`${name}.valueString`}/>;
};

const NumberValueInput = ({ item, name }) => {
    return <FormikInput withoutErrorText className="w-100" type="number" value={item.value} name={`${name}.valueNumber`}/>;
};

const RangeValueInput = ({ item, name }) => {
    return <div className="d-flex w-100 align-items-center justify-content-between gap-2">
        <FormikInput withoutErrorText className="w-100" containerClassName="w-100" type="number" value={item.rangeFrom} name={`${name}.valueFrom`}/>
        {'-'}
        <FormikInput withoutErrorText type="number" containerClassName="w-100" className="w-100" name={`${name}.valueTo`} value={item.rangeTo}/>
    </div>;
};

const EmptyInput = () => {
    return null
};

const schemaValueFields = {
    [CONDITION_TYPES.BOOLEAN]: {
        [CONDITION_OPERATORS.EQUAL]: BooleanValueInput,
        [CONDITION_OPERATORS.IS_EMPTY]: EmptyInput,
    },
    [CONDITION_TYPES.TERM]: {
        [CONDITION_OPERATORS.IS_EMPTY]: EmptyInput,
        default: TextValueInput,
    },
    [CONDITION_TYPES.NUMBER]: {
        [CONDITION_OPERATORS.IS_EMPTY]: EmptyInput,
        [CONDITION_OPERATORS.BETWEEN]: RangeValueInput,
        default: NumberValueInput,
    },
    [CONDITION_TYPES.NUMBER_RANGE]: {
        [CONDITION_OPERATORS.IS_EMPTY]: EmptyInput,
        default: RangeValueInput,
    },
}

const ValueInput = ({ name, item, setFieldValue, operation, type, errors }) => {
    const props = {
        name,
        item,
        setFieldValue,
        errors
    };

    const Component = schemaValueFields[type][operation] || schemaValueFields[type].default

    if (!Component) return null

    return <Component {...props} />
};


export default ValueInput;