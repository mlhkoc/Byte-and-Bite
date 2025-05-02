import React from 'react';
import { TrendingUp, Package, Star } from 'lucide-react';
import { useDelivery } from '../context/DeliveryContext';

const PerformanceSummary: React.FC = () => {
  const { dailyPerformance } = useDelivery();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-4">Today's Performance</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Earnings</p>
          <div className="flex items-center justify-center">
            <TrendingUp className="text-green-500 mr-1" size={16} />
            <p className="text-lg font-semibold">£{dailyPerformance.earnings.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Deliveries</p>
          <div className="flex items-center justify-center">
            <Package className="text-blue-500 mr-1" size={16} />
            <p className="text-lg font-semibold">{dailyPerformance.deliveries}</p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Rating</p>
          <div className="flex items-center justify-center">
            <Star className="text-yellow-500 mr-1" size={16} fill="currentColor" />
            <p className="text-lg font-semibold">{dailyPerformance.rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummary;