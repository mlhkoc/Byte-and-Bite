import React from 'react';
import { Package } from 'lucide-react';
import { useUser } from '../context/UserContext';
import AvailabilityToggle from './AvailabilityToggle';

const Header: React.FC = () => {
  const { user } = useUser();

  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white mr-3">
            <Package size={20} />
          </div>
          <h1 className="text-lg font-semibold">Welcome, {user?.name || 'Courier'}</h1>
        </div>
        
        <AvailabilityToggle />
      </div>
    </header>
  );
};

export default Header;