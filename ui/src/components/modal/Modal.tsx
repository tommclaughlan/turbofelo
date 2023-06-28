import React from "react";
import "./modal.css";

interface ModalProps {
    handleClose: () => void;
    show: boolean;
    children: React.ReactNode;
}

const Modal = ({ handleClose, show, children }: ModalProps) => {
    const showHideClassName = show ? "modal is-active" : "modal";

    return (
        <div className={showHideClassName}>
            <div className="modal-background" onClick={handleClose} />
            {children}
        </div>
    );
};

export default Modal;
