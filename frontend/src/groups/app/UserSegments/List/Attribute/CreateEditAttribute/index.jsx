// Libs
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { ModalFooter } from "reactstrap";

// Components, Views, Screens
import Button from "../../../../../../base/components/Button";
import FormikReactSelect from "../../../../../../base/components/FormikReactSelect";
import FormikInput from "../../../../../../base/components/FormikInput";

// Hooks, Utils, Helpers
import { useService } from "../../../../../../base/hooks/useService";
import { useLoading } from "../../../../../../base/hooks/useLoading";
import joinClassNames from "../../../../../../base/helpers/joinClassNames";
import PageSpinner from "../../../../../../base/components/PageSpinner";
import ToastService from "../../../../../../services/ToastService";
import { BUTTON_COLORS } from "../../../../../../base/components/Button/appearance";
import { initialValues, validationSchema } from "./form";
import { useModal } from "../../../../../../base/hooks/useModal";
import UserSegmentsService from "../../../../../../services/UserSegmentsService";
import { MAX_LABEL_LENGTH, MAX_NAME_LENGTH } from "./constants";
import { ATTRIBUTE_TYPE_LABELS } from "../../../constants";

export function CreateEditAttribute({ isOpen, close, selectedAttribute, afterSubmit }) {
    /**
     * @type {UserSegmentsService}
     */
    const userSegmentsService = useService(UserSegmentsService);
    /**
     * @type {ToastService}
     */
    const toastService = useService(ToastService);
    const [isLoading, { registerPromise }] = useLoading(true);

    const { Modal } = useModal();
    const { search: locationSearch } = useLocation();

    const [isSubmitting, updateIsSubmitting] = useState(false);
    const [attribute, setAttribute] = useState(null);
    const [categories, setCategories] = useState([]);

    const isEditMode = Boolean(selectedAttribute);

    const afterSuccess = () => {
        toastService.success("Attribute has been successfully saved");
        updateIsSubmitting(false);
        afterSubmit();
        close();
    };

    const apiFunction = (attribute) => {
        if (isEditMode) {
            return userSegmentsService.updateAttribute(selectedAttribute, attribute);
        }

        return userSegmentsService.createAttributes(attribute);
    };

    const submitAttribute = (values) => {
        updateIsSubmitting(true);

        apiFunction(values)
            .then(afterSuccess)
            .finally(() => updateIsSubmitting(false));
    };

    const mapAttributeToForm = (attribute) => {
        return {
            label: attribute.label,
            name: attribute.name,
            type: attribute?.type?.toString() || null,
            attributeCategoryId: attribute?.attributeCategoryId?.toString() || null,
            quizVariableName: attribute.quizVariableName
        };
    };

    useEffect(() => {
        registerPromise(userSegmentsService.getAttributesCategories().then(({ data }) => {
            const attributesLabels = {};
            data.forEach((item) => {
                attributesLabels[item.id] = item.name;
            });
            setCategories(attributesLabels);
        }));
    }, []);

    useEffect(() => {
        if (isEditMode) {
            registerPromise(userSegmentsService.getAttributeById(selectedAttribute))
                .then((data) => {
                    setAttribute(mapAttributeToForm(data));
                });
        }
    }, [isEditMode]);

    if (isLoading) return <PageSpinner/>;

    return (
        <Modal isOpen={isOpen} toggle={() => close()}>
            <Modal.Header onClose={() => close()}>
                {isEditMode ? "Edit attribute" : "Create attribute"}
            </Modal.Header>

            <Formik
                initialValues={attribute || initialValues}
                validationSchema={validationSchema}
                validateOnBlur
                onSubmit={submitAttribute}
                enableReinitialize
            >
                {({ errors, handleSubmit, values, setFieldValue }) => {
                    return (
                        <form
                            className={joinClassNames("form-horizontal p-2", isSubmitting && "pointer-events-none")}
                            onSubmit={handleSubmit}
                        >
                            <Modal.Body>
                                <div>
                                    <FormikInput
                                        label="Label"
                                        maxLength={MAX_LABEL_LENGTH}
                                        name="label"
                                        placeholder="Enter label (required)"
                                        containerClassName="mt-3"
                                    />

                                    <FormikInput
                                        label="Name"
                                        maxLength={MAX_NAME_LENGTH}
                                        name="name"
                                        placeholder="Enter name (required)"
                                        containerClassName="mt-3"
                                    />

                                    <FormikReactSelect
                                        label="Category"
                                        name="attributeCategoryId"
                                        placeholder="Select category (required)"
                                        containerClassName="mt-3"
                                        setFieldValue={setFieldValue}
                                        options={Object.entries(categories)
                                            .map(([value, label]) => ({ value, label }))}
                                    />

                                    <FormikReactSelect
                                        label="Type"
                                        name="type"
                                        placeholder="Select type (required)"
                                        containerClassName="mt-3"
                                        setFieldValue={setFieldValue}
                                        options={Object.entries(ATTRIBUTE_TYPE_LABELS)
                                            .map(([value, label]) => ({ value, label }))}
                                    />

                                    <FormikInput
                                        label="Quiz variable name"
                                        name="quizVariableName"
                                        placeholder="Enter quiz variable name (optional)"
                                        containerClassName="mt-3"
                                    />

                                </div>
                            </Modal.Body>

                            <ModalFooter>
                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <Button
                                        color={BUTTON_COLORS.primaryOutline}
                                        type="button"
                                        onClick={close}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        color={BUTTON_COLORS.primary}
                                        type="submit"
                                        disabled={!!Object.keys(errors).length || isSubmitting}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </ModalFooter>
                        </form>
                    );
                }}
            </Formik>
        </Modal>);
}