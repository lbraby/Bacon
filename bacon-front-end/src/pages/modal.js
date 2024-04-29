import "./modal.css";
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal">
          {children}
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
};
export default Modal;