import React from "react";
import { PiCopyrightFill } from "react-icons/pi";

const Footer = () => {
  return (
    <div className="bg-stone-800 text-white py-4 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <PiCopyrightFill className="text-gray-200" />
        <h4 className="text-gray-200">Adies Capstone Hub</h4>
      </div>
    </div>
  );
};

export default Footer;