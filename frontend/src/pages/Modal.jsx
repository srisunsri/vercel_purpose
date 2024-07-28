// Modal.js
import React from 'react';
import 'tailwindcss/tailwind.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        {children}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
