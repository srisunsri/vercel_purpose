// DonationForm.js
import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const DonationForm = () => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleUPIPayment = (e) => {
    e.preventDefault();
    const upiId = 'lekhanapatel6@okhdfcbank'; // Replace with your UPI ID
    const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=Donation`;

    window.location.href = upiUrl;
  };

  return (
    <form onSubmit={handleUPIPayment} className="space-y-4">
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Donate via UPI
      </button>
    </form>
  );
};

export default DonationForm;
