/* eslint-disable no-unused-vars */
import React from 'react';
import woman from '../assets/hero.jpg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ChatbotUI  from './ChatbotUI';

const Trainer = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex justify-center items-center min-h-screen p-4 bg-green-100">
      <div className="box flex flex-col md:flex-row justify-center items-center bg-white p-6 rounded-lg shadow-lg">
        <div className="right md:w-1/2 mb-4 md:mb-0 md:mr-4">
          <img
            src={woman}
            alt="Example Image"
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="left md:w-1/2 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Get Started
          </h2>
          <div className="flex flex-col items-center">
            <Link to="/monitortrainee">
              <button className="bg-green-600 text-white px-4 py-2 rounded mb-2 w-full max-w-xs hover:bg-green-700">
                Monitor Trainee
              </button>
            </Link>
            <Link to="/monitorcustomer">
              <button className="bg-green-600 text-white px-4 py-2 rounded w-full max-w-xs hover:bg-green-700">
                Monitor Customer
              </button>
            </Link>
          </div>
        </div>
      </div>
      <button className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500" onClick={() => navigate('/chatbot')}>
        Chatbot
      </button>
    </div>
  );
};

export default Trainer;
