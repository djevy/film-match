import React from "react";
import "./Modal.css";

function Modal(props) {
  return (
    <div>
      {props.isOpen && (
        <div className={`modal ${props.isOpen ? "open" : "closed"}`}>
          <div className="modal-content">
            <span className="close" onClick={props.toggleModal}>
              &times;
            </span>
            {props.children}
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
