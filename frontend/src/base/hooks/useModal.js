import {CustomModal, ModalBody, ModalHeader} from "../components/CustomModal";
import {useCallback, useState} from "react";

const Modal = CustomModal;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;

/**
 *
 * @returns {{open: ((function(): void)), close: (*|(function(): void)), isOpen: boolean, Modal: CustomModal, getModalProps: (*|(function(): {isOpen: boolean, container: string, onClose: (*|(function(): void))}))}}
 */
export const useModal = () => {
    const [isOpen, updateIsOpen] = useState(false);
    const close = useCallback(() => updateIsOpen(false), []);
    const open = useCallback(() => updateIsOpen(true), []);

    const getModalProps = useCallback(() => {
        return {
            isOpen,
            container: "modal",
            onClose: close
        }
    }, [isOpen, close]);

    return {open, close, isOpen, Modal, getModalProps}
};
