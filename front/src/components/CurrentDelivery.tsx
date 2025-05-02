import React from 'react';
import { MapPin, Navigation, Package } from 'lucide-react';
import { useDelivery } from '../context/DeliveryContext';

export const CurrentDelivery: React.FC = () => {
  const { currentDelivery, markAsPickedUp, markAsDelivered } = useDelivery();

  if (!currentDelivery) return null;

  //<div className="flex justify-between mt-1">
  //        <span className="text-sm text-gray-600">{currentDelivery.distance}</span>
  //        <span className="text-base font-semibold">£{currentDelivery.amount.toFixed(2)}</span>
  //      </div >
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-4">Current Delivery</h2>
      
      <div className="mb-4">
        <h3 className="text-base font-medium">{currentDelivery.restaurantName}</h3>
        <p className="text-sm text-gray-600">{currentDelivery.address}</p>
        
      </div>
      
      {/* Map visualization */}
      <div className="relative w-full h-40 bg-gray-200 rounded-md mb-4 overflow-hidden">
        {/* This would be replaced with an actual map component in a real application */}
        <div className="absolute inset-0 bg-[url('https://miro.medium.com/v2/resize:fit:1400/1*qYUvh-EtES8dtgKiBRiLsA.png')] bg-cover bg-center"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => {}}
        >
          <Navigation size={18} />
          Navigate
        </button>
        
        {currentDelivery.status === 'accepted' ? (
          <button 
            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            onClick={markAsPickedUp}
          >
            <Package size={18} />
            Mark as Picked Up
          </button>
        ) : (
          <button 
            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            onClick={markAsDelivered}
          >
            <MapPin size={18} />
            Mark as Delivered
          </button>
        )}
      </div>
    </div>
  );
};

export default CurrentDelivery;