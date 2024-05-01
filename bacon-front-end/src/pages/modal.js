import "./modal.css";
import { useRef } from "react";

const Modal = ({ isOpen, children, onClickOutside }) => {
    const modalRef = useRef(null);
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClickOutside();
      }
    }
    if (!isOpen) return null;
    return (
      <div className="modal-overlay" onClick={handleClickOutside}>
        <div className="modal" ref={modalRef}>
          {children}
        </div>
      </div>
    );
};
export default Modal;