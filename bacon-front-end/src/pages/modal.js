import "./modal.css";
const Modal = ({ isOpen, children }) => {
    // TODO: add onClickOutside
    if (!isOpen) return null;
    return (
      <div className="modal-overlay">
        <div className="modal">
          {children}
        </div>
      </div>
    );
};
export default Modal;