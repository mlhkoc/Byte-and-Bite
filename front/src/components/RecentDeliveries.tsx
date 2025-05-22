import React from 'react';
import { Star } from 'lucide-react';
import { useDelivery } from '../context/DeliveryContext';

const RecentDeliveries: React.FC = () => {
  const { recentDeliveries } = useDelivery();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Deliveries</h2>

      <div className="space-y-4">
        {recentDeliveries.map((delivery) => (
          <div key={delivery.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between mt-1">
              <p className="text-sm text-gray-600">Completed at {formatDate(delivery.deliveryDate)}</p>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-1">{delivery.rating}</span>
                <Star size={16} className="text-yellow-500" fill="currentColor" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDeliveries;
