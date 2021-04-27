import { useEffect } from 'react'
import { createPortal } from 'react-dom';
import './styles/Modal.scss'

const Modal = ({ children }) => {
  const mount = document.getElementById("modal");

  return createPortal(
    <div className="modal__container">
      {children}
    </div>,
     mount)
}

export default Modal;
