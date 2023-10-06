import React from "react";
import { FaCopyright } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="bg-stone-800 text-white py-4 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <FaCopyright className="text-gray-200" />
        <h4 className="text-gray-200">Adies Capstone Hub</h4>
      </div>
    </div>
  );
};

export default Footer;