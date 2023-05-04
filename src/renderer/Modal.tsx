import React from 'react';
import './Modal.css';

const Modal = ({ closeModal, modalMessage }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title"></h4>
        </div>
        <div className="modal-body">{modalMessage}</div>
        <div className="modal-footer">
          <button className="btn" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
