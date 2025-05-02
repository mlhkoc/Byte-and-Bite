// AvailabilityToggle.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const AvailabilityToggle: React.FC = () => {
  const { isAvailable, toggleAvailability } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Availability Status:</span>
      <button
        onClick={toggleAvailability}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isAvailable ? 'bg-green-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isAvailable ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
        <span className="sr-only">Toggle Availability</span>
      </button>
      <span className={`text-sm font-semibold ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
        {isAvailable ? 'Available' : 'Unavailable'}
      </span>
    </div>
  );
};

export default AvailabilityToggle;
