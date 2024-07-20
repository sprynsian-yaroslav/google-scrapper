// Libs
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";

// Components, Views, Screens
import Title from "../../../../base/components/Title";
import BaseLayoutWithCard from "../../../../base/components/BaseLayoutWithCard";
import FormikInput from "../../../../base/components/FormikInput";
import Button from "../../../../base/components/Button";
import { FormikConditionsField } from "../../../../base/components/FormikConditionsField/FormikConditionsField";
import AttributesDropdown from "../../../../base/components/Dropdowns/AttributesDropdown/AttributesDropdown";

// Hooks, Utils, Helpers
import { useService } from "../../../../base/hooks/useService";
import UserSegmentsService from "../../../../services/UserSegmentsService";
import ToastService from "../../../../services/ToastService";
import { USER_SEGMENTS_GROUP_LINKS } from "../config";
import joinClassNames from "../../../../base/helpers/joinClassNames";
import { initialValues, validationSchema } from "./form";
import { MAX_SEGMENT_NAME_LENGTH, MIN_PRIORITY, MAX_PRIORITY } from "./constants";
import { BUTTON_COLORS } from "../../../../base/components/Button/appearance";
import { useQueryString } from "../../../../base/hooks/useQueryString";
import { isBoolean } from "lodash";



export function CreateEditUserSegment() {
    /**
     * @type {UserSegmentsService}
     */
    const userSegmentService = useService(UserSegmentsService);

    /**
     * @type {ToastService}
     */
    const toastService = useService(ToastService);
    const navigate = useNavigate();

    const [isSubmitting, updateIsSubmitting] = useState(false);
    const [attributes, updateAttributes] = useState([]);
    const [segment, updateSegment] = useState(null);

    const allAttributes = attributes.reduce((acc, item) => {
        return [...acc, ...item.attributes];
    }, []);

    const afterSuccess = () => {
        toastService.success("User segment has been successfully saved");
        navigate(`${USER_SEGMENTS_GROUP_LINKS.LIST}`);
        updateIsSubmitting(false);
    };
    const { search: locationSearch } = useLocation();

    const {
        params: {
            editSegmentId
        }
    } = useQueryString(locationSearch);

    const mapConditionToFormValue = (conditions = []) => {
        return {
            relationType: conditions.relationType,
            rules: conditions.rules.map((item) => {
                const {
                    valueBoolean,
                    valueNumber,
                    valueFrom,
                    valueString,
                    valueTo,
                    operator
                } = item

                return item.relationType
                    ? mapConditionToFormValue(item)
                    : {
                        valueBoolean: isBoolean(valueBoolean) ? valueBoolean?.toString() : null,
                        valueNumber,
                        valueFrom,
                        valueString,
                        valueTo,
                        operator,
                        option: allAttributes.find(attribute => {
                            return attribute.id === item.attributeId;
                        })
                    };
            })
        };
    };

    const mapConditionToRule = ({ option, valueBoolean, valueNumber, valueFrom, valueTo, valueString, operator }) => {

        return {
            attributeId: option?.id,
            valueBoolean,
            valueNumber,
            valueFrom,
            valueTo,
            valueString,
            operator
        };
    };

    const mapFormValueToCondition = (conditions) => {
        return {
            relationType: conditions.relationType,
            rules: conditions.rules.map((item) => {
                return item.relationType ? mapFormValueToCondition(item) : mapConditionToRule(item);
            })
        };
    };

    const apiFunction = (segment) => {
        if (editSegmentId) {
            return userSegmentService.updateSegments(editSegmentId, segment);
        }

        return userSegmentService.createSegments(segment);
    };


    const createUserSegment = ({ conditions, ...otherValues }) => {
        updateIsSubmitting(true);
        apiFunction({
            ...otherValues,
            ruleGroup: mapFormValueToCondition(conditions)
        })
            .then(afterSuccess)
            .finally(() => updateIsSubmitting(false));
    };


    const breadcrumbs = {
        title: editSegmentId ? "Edit User segment" : "Create User segment",
        breadcrumbItems: [
            { title: "User Segments", link: USER_SEGMENTS_GROUP_LINKS.BASE },
            { title: editSegmentId ? "Edit User segment" : "Create User segment" }
        ]
    };

    const getAttributes = () => {
        userSegmentService.getAttributesCategories().then(({ data }) => {
            updateAttributes(data);
        });
    };

    useEffect(() => {
        if (editSegmentId && attributes.length) {
            userSegmentService.getSegmentById(editSegmentId)
                .then((data) => {
                    updateSegment({
                        fullName: data.fullName,
                        priority: data.priority,
                        conditions: mapConditionToFormValue(data.ruleGroup)
                    });
                });
        }
    }, [editSegmentId, attributes]);

    useEffect(() => {
        getAttributes();
    }, []);


    return <BaseLayoutWithCard breadcrumbs={breadcrumbs}>
        <Formik
            initialValues={segment || initialValues}
            validationSchema={validationSchema}
            validateOnBlur
            onSubmit={createUserSegment}
            enableReinitialize
        >
            {({ errors, handleSubmit, values, setFieldValue }) => {

                return <form className={joinClassNames("form-horizontal p-2", isSubmitting && "pointer-events-none")}
                             onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Title
                            title="General information"
                        />
                    </div>
                    <section className="w-50">
                        <FormikInput
                            placeholder="Enter full name (required)"
                            name="fullName"
                            maxLength={MAX_SEGMENT_NAME_LENGTH}
                            label="Full name"
                            containerClassName="mt-3"
                        />

                        <FormikInput
                            type="number"
                            placeholder="Please enter priority from 1 to 999"
                            name="priority"
                            max={MAX_PRIORITY}
                            min={MIN_PRIORITY}
                            label="Priority"
                            containerClassName="mt-3"
                        />

                        <div className="mt-3">
                            <label>Conditions</label>
                            <FormikConditionsField
                                name="conditions"
                                value={values.conditions}
                                setValue={setFieldValue}
                                selectorComponent={(propsSelector) => (
                                    <AttributesDropdown attributes={attributes} {...propsSelector} />
                                )}
                                errors={errors?.conditions}
                            />
                        </div>
                    </section>

                    <div className="d-flex justify-content-end mt-5">
                        <Button
                            color={BUTTON_COLORS.primary}
                            type="submit"
                            disabled={!!Object.keys(errors).length || isSubmitting}
                        >
                            Save user segment
                        </Button>
                    </div>
                </form>;
            }}
        </Formik>
    </BaseLayoutWithCard>;
}