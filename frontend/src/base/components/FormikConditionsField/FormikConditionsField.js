import React, { useEffect, useState } from "react";
import { FieldArray } from "formik";
import SelectorWrapper from "./SelectorWrapper";
import OperatorSelector from "./OperatorSelector";
import ValueInput from "./ValueInput";
import styles from "./FormikConditionalField.module.scss";
import { LogicalRelationSelector } from "./LogicalRelationSelector";
import Icon from "../Icon";
import classnames from "classnames";
import { noop } from "lodash";

const LEVEL_PADDING = 48;

const MAX_LEVEL = 10;

export const FormikConditionsField = ({
                                          value = {},
                                          setValue,
                                          selectorComponent,
                                          name = "conditionField",
                                          level = 0,
                                          errors,
                                          deleteGroup = noop,
                                          absoluteCountLevels = 1
                                      }) => {

    const [countLevels, setCountLevels] = useState(absoluteCountLevels)

    const currentRelationType = value.relationType;
    const rules = value.rules;

    const handleChangeCondition = ({
                                       relationType,
                                       index
                                   }) => {
        if (countLevels >= MAX_LEVEL) return;

        const countElements = rules.length;

        const isTwoItem = countElements === 2;

        if (isTwoItem) {
            setValue(`${name}.relationType`, relationType);
            return;
        }

        const nextItemIndex = index + 1;

        setValue(`${name}.rules`, [
            ...rules.filter((_, itemIndex) => itemIndex !== index && itemIndex !== nextItemIndex),
            {
                relationType,
                rules: [rules[index], rules[nextItemIndex]]
            }
        ]);
    };

    const handleClickDelete = ({ remove, index }) => {
        if (rules.length === 1) {
            deleteGroup()
        } else {
            remove(index)
        }
    }

    const calculateLevels = (level = [], countLevels = 1) => {
        const conditionsGroupsInLevel = level.filter(item => !!item.rules)

        if (conditionsGroupsInLevel.length) {
            const nextLevelItems = conditionsGroupsInLevel.reduce((acc, item) => {
                return [...acc, ...item.rules]
            }, [])

            return calculateLevels(nextLevelItems, countLevels + 1)
        } else {
            return countLevels
        }
    }

    useEffect(() => {
        if (level === 0) {
            setCountLevels(calculateLevels(value.rules))
        } else {
            setCountLevels(absoluteCountLevels)
        }
    }, [value, absoluteCountLevels])


    return <FieldArray name={`${name}.rules`}>
        {({ remove, push }) => (
            <div className={classnames("w-100 bg-body ", level ? "p-0" : "p-3")}>
                {rules.map((condition, index) => {
                    if (condition.relationType) {
                        return <div
                            key={index}
                            className="w-100 position-relative"
                            style={{ paddingLeft: level ? `${LEVEL_PADDING}px` : 0 }}
                        >
                            <FormikConditionsField
                                value={condition}
                                setValue={setValue}
                                selectorComponent={selectorComponent}
                                name={`${name}.rules[${index}]`}
                                level={level + 1}
                                errors={errors?.rules?.[index]}
                                deleteGroup={() => remove(index)}
                                absoluteCountLevels={countLevels}
                            />

                            {index < (rules.length - 1) &&
                                <div className={styles.ConditionsFieldsRow}>
                                    <LogicalRelationSelector
                                        value={currentRelationType}
                                        setValue={(relationType) => handleChangeCondition({
                                            relationType,
                                            index,
                                            value,
                                            fieldName: name
                                        })}
                                    />

                                </div>}
                        </div>;
                    }

                    return (
                        <div
                            key={index}
                            className="w-100 position-relative"
                            style={{ paddingLeft: level ? `${LEVEL_PADDING}px` : 0 }}
                        >
                            <div className={styles.ConditionsFieldsRow}>
                                <label className={styles.Label}>If</label>
                                <div className={styles.Fields}>
                                    <SelectorWrapper
                                        setFieldValue={(valueOption) => {
                                            setValue(`${name}.rules.[${index}]`, {
                                                ...condition,
                                                option: valueOption,
                                                operator: null,
                                                valueNumber: null,
                                                valueString: null,
                                                valueBoolean: null,
                                                valueTo: null,
                                                valueFrom: null
                                            });
                                        }}
                                        value={rules[index].option?.name}
                                        name={`${name}.rules.[${index}].option`}
                                        error={errors?.rules?.[index]?.option}
                                    >
                                        {selectorComponent}
                                    </SelectorWrapper>

                                    <div
                                        onClick={() => {
                                            handleClickDelete({remove, index});
                                        }}
                                        className={styles.TrashIcon}>
                                        <Icon icon="trashIcon" width={24} height={24}/>
                                    </div>
                                </div>
                            </div>

                            {rules[index]?.option && <div className={styles.ConditionsFieldsRow}>
                                <label className={styles.Label}>Value</label>

                                <div className={styles.Fields}>
                                    <div className={styles.OperatorField}>
                                        <OperatorSelector
                                            value={rules?.[index]?.operator}
                                            setFieldValue={(value) => {
                                                setValue(`${name}.rules[${index}]`, {
                                                    ...condition,
                                                    operator: value,
                                                    valueNumber: null,
                                                    valueString: null,
                                                    valueBoolean: null,
                                                    valueTo: null,
                                                    valueFrom: null
                                                });
                                            }}
                                            type={rules[index]?.option?.type}
                                            index={index}
                                            error={errors?.rules?.[index]?.operator}
                                        />
                                    </div>

                                    <div className={styles.ValueField}>
                                        <ValueInput
                                            name={`${name}.rules[${index}]`}
                                            item={rules[index]}
                                            type={rules[index]?.option?.type}
                                            operation={rules[index]?.operator}
                                            setFieldValue={setValue}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </div>}

                            {(index < (rules.length - 1)) &&
                                <div className={styles.ConditionsFieldsRow}>
                                    <LogicalRelationSelector
                                        value={currentRelationType}
                                        setValue={(relationType) => handleChangeCondition({
                                            relationType,
                                            index,
                                            value,
                                            fieldName: name
                                        })}
                                    />
                                </div>
                            }
                        </div>
                    );
                })}
                {
                    ((!rules.length && !level) || !!rules.length) && <div
                        className="text-primary w-fit-content cursor-pointer mb-4"
                        style={{ paddingLeft: level ? `${LEVEL_PADDING}px` : 0 }}
                        onClick={
                            () => {
                                const newItem = {
                                    operator: null,
                                    valueNumber: null,
                                    valueString: null,
                                    valueBoolean: null,
                                    valueTo: null,
                                    valueFrom: null
                                };

                                push(newItem);
                            }

                        }
                    >
                        + Add condition
                    </div>
                }
            </div>
        )}
    </FieldArray>;
};
