import React from 'react';
import { useDelivery } from '../context/DeliveryContext';

const DeliveryRequest: React.FC = () => {
  const { newDeliveryRequest, acceptDelivery, rejectDelivery } = useDelivery();

  if (!newDeliveryRequest) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-4">New Delivery Request</h2>
      
      <div className="mb-4">
        <h3 className="text-base font-medium">{newDeliveryRequest.restaurantName}</h3>
        <p className="text-sm text-gray-600">{newDeliveryRequest.address}</p>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">{newDeliveryRequest.distance}</span>
          <span className="text-base font-semibold">£{newDeliveryRequest.amount.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          onClick={acceptDelivery}
        >
          Accept
        </button>
        <button 
          className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
          onClick={rejectDelivery}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default DeliveryRequest;