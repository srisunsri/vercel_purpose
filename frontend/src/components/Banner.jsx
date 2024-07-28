// Banner.js
import React, { useState } from 'react';
import Modal from '../pages/Modal';

import 'tailwindcss/tailwind.css';
import DonationForm from './DonationForm';

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full bg-gray-100 h-64 flex flex-col items-center justify-center text-center p-6">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2">Support Our Cause</h2>
        <p className="text-lg mb-4">Your donation helps us make a difference in the community.</p>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Support Us
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <DonationForm/>
      </Modal>
    </div>
  );
};

export default Banner;
