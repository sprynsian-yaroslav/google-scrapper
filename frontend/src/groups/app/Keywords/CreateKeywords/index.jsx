// Libs
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik } from "formik";
import { ModalFooter } from "reactstrap";

// Components, Views, Screens
import Button from "../../../../base/components/Button";
import FormikInput from "../../../../base/components/FormikInput";

// Hooks, Utils, Helpers
import { useService } from "../../../../base/hooks/useService";
import { useLoading } from "../../../../base/hooks/useLoading";
import joinClassNames from "../../../../base/helpers/joinClassNames";
import PageSpinner from "../../../../base/components/PageSpinner";
import ToastService from "../../../../services/ToastService";
import { BUTTON_COLORS } from "../../../../base/components/Button/appearance";
import { initialValues, validationSchema } from "./form";
import { useModal } from "../../../../base/hooks/useModal";
import KeywordsService from "../../../../services/KeywordsService";
import { MAX_LABEL_LENGTH } from "./constants";
import DatePicker from "react-datepicker";

export function CreateKeywords({ isOpen, close, afterSubmit }) {
    /**
     * @type {KeywordsService}
     */
    const keywordsService = useService(KeywordsService);
    /**
     * @type {ToastService}
     */
    const toastService = useService(ToastService);

    const { Modal } = useModal();
    const { search: locationSearch } = useLocation();

    const [isSubmitting, updateIsSubmitting] = useState(false);

    const afterSuccess = () => {
        toastService.success("Keyword has been successfully saved");
        updateIsSubmitting(false);
        afterSubmit();
        close();
    };

    const apiFunction = (values) => {
        return keywordsService.createKeyword(values);
    };

    const submitAttribute = (values) => {
        updateIsSubmitting(true);

        apiFunction(values)
            .then(afterSuccess)
            .finally(() => updateIsSubmitting(false));
    };

    console.log("Modal", isOpen)

    return (
        <Modal isOpen={isOpen} toggle={() => close()}>
            <Modal.Header onClose={() => close()}>
                Create keyword
            </Modal.Header>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnBlur
                onSubmit={submitAttribute}
                enableReinitialize
            >
                {({ errors, handleSubmit }) => {
                    return (
                        <form
                            className={joinClassNames("form-horizontal p-2", isSubmitting && "pointer-events-none")}
                            onSubmit={handleSubmit}
                        >
                            <Modal.Body>
                                <div>
                                    <FormikInput
                                        label="Keyword"
                                        maxLength={MAX_LABEL_LENGTH}
                                        name="keyword"
                                        placeholder="Enter keyword (required)"
                                        containerClassName="mt-3"
                                    />

                                    <FormikInput
                                        label="Context Words"
                                        name="contextWords"
                                        placeholder="Enter context words (comma separated)"
                                        containerClassName="mt-3"
                                    />
                                    <FormikInput
                                        label="Exclude Words"
                                        name="excludeWords"
                                        placeholder="Enter exclude words (comma separated)"
                                        containerClassName="mt-3"
                                    />
                                    <FormikInput
                                        label="Site Filter"
                                        name="siteFilter"
                                        placeholder="Enter site filter (optional)"
                                        containerClassName="mt-3"
                                    />

                                    <FormikInput
                                        label="Year"
                                        name="searchDate"
                                        placeholder="Enter year (YYYY)"
                                        maxLength={4}
                                        type="text"
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