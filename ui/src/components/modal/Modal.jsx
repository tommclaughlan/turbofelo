import './modal.css';

const Modal = ({ handleClose, show, children, title }) => {
  const showHideClassName = show ? "modal is-active" : "modal";

  return (
    <div className={showHideClassName}>
      <div className='modal-background' onClick={handleClose}/>
      {children}
    </div>
  );
};

export default Modal;