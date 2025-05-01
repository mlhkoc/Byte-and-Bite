import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Delivery, DailyPerformance } from '../types';

// Sample data for demonstration
const SAMPLE_RECENT_DELIVERIES: Delivery[] = [
  {
    id: '1',
    restaurantName: 'Burger King',
    address: '123 Main St, Downtown',
    distance: '1.8 miles',
    amount: 7.25,
    status: 'completed',
    completedAt: '2:30 PM',
    rating: 5.0
  },
  {
    id: '2',
    restaurantName: 'Pizza Hut',
    address: '456 Oak Ave, Midtown',
    distance: '2.2 miles',
    amount: 8.50,
    status: 'completed',
    completedAt: '1:15 PM',
    rating: 4.8
  },
  {
    id: '3',
    restaurantName: 'Subway',
    address: '789 Pine St, Uptown',
    distance: '1.5 miles',
    amount: 6.75,
    status: 'completed',
    completedAt: '12:45 PM',
    rating: 4.9
  }
];

// Sample new delivery request
const SAMPLE_NEW_DELIVERY: Delivery = {
  id: '4',
  restaurantName: 'Thai Express Restaurant',
  address: '123 Main St, Downtown',
  distance: '2.5 miles',
  amount: 8.50,
  status: 'pending'
};

interface DeliveryContextType {
  currentDelivery: Delivery | null;
  newDeliveryRequest: Delivery | null;
  recentDeliveries: Delivery[];
  dailyPerformance: DailyPerformance;
  acceptDelivery: () => void;
  rejectDelivery: () => void;
  markAsPickedUp: () => void;
  markAsDelivered: () => void;
}

export const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const DeliveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDelivery, setCurrentDelivery] = useState<Delivery | null>(null);
  const [newDeliveryRequest, setNewDeliveryRequest] = useState<Delivery | null>(SAMPLE_NEW_DELIVERY);
  const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>(SAMPLE_RECENT_DELIVERIES);
  const [dailyPerformance, setDailyPerformance] = useState<DailyPerformance>({
    earnings: 85.50,
    deliveries: 12,
    rating: 4.8
  });

  const calculateDailyPerformance = () => {
    const totalEarnings = recentDeliveries.reduce((sum, delivery) => sum + delivery.amount, 0);
    const avgRating = recentDeliveries.reduce((sum, delivery) => sum + (delivery.rating || 0), 0) / recentDeliveries.length;
    
    setDailyPerformance({
      earnings: totalEarnings,
      deliveries: recentDeliveries.length,
      rating: parseFloat(avgRating.toFixed(1))
    });
  };

  useEffect(() => {
    calculateDailyPerformance();
  }, [recentDeliveries]);

  const acceptDelivery = () => {
    if (newDeliveryRequest) {
      const accepted = { ...newDeliveryRequest, status: 'accepted' as const };
      setCurrentDelivery(accepted);
      setNewDeliveryRequest(null);
    }
  };

  const rejectDelivery = () => {
    setNewDeliveryRequest(null);
    // In a real app, could request a new delivery after a short delay
  };

  const markAsPickedUp = () => {
    if (currentDelivery) {
      setCurrentDelivery({ ...currentDelivery, status: 'picked_up' });
    }
  };

  const markAsDelivered = () => {
    if (currentDelivery) {
      const delivered: Delivery = {
        ...currentDelivery,
        status: 'completed',
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rating: 5.0,
      };

      // Now update the list
      setRecentDeliveries(prev => [delivered, ...prev]);
      setCurrentDelivery(null);
    }
  };

  return (
    <DeliveryContext.Provider
      value={{
        currentDelivery,
        newDeliveryRequest,
        recentDeliveries,
        dailyPerformance,
        acceptDelivery,
        rejectDelivery,
        markAsPickedUp,
        markAsDelivered
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = (): DeliveryContextType => {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};