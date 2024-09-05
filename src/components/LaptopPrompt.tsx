"use client"

import React from 'react';
import { Laptop } from 'lucide-react';

const LaptopPrompt: React.FC = () => {
  return (
    <div className="laptop-prompt fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-4">
        <div className="flex items-center mb-4">
          <Laptop className="h-8 w-8 text-blue-500 mr-3" />
          <h2 className="text-xl font-bold">Optimal Experience</h2>
        </div>
        <p className="mb-4 text-gray-700">
          For the best experience while building and interacting with chatbots, we recommend using a laptop or desktop computer. Some features may not be fully accessible on mobile devices.
        </p>
      </div>
    </div>
  );
};

export default LaptopPrompt;
