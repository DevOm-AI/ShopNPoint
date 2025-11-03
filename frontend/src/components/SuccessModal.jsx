import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
      
      {/* Modal Panel */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full m-4 transform transition-all duration-300 scale-100">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Title */}
          <h3 className="text-3xl font-bold text-blue-600 mb-4">{title}</h3>

          {/* Content/Children */}
          <div className="text-gray-600 text-lg space-y-4">
            {children}
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={onClose}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 text-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;