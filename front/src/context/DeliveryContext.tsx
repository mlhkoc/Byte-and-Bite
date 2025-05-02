import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Delivery, DailyPerformance } from '../types';
import { useAuth } from './AuthContext';

// Define allowed status values for type safety
type DeliveryStatus = 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'completed';

// Map frontend statuses to backend-friendly versions
const statusToBackend: Record<DeliveryStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  picked_up: 'Picked Up',
  delivered: 'Delivered',
  completed: 'Completed',
};

// Optionally: map backend statuses to frontend if needed
const statusFromBackend: Record<string, DeliveryStatus> = {
  Pending: 'pending',
  Accepted: 'accepted',
  'Picked Up': 'picked_up',
  Delivered: 'delivered',
  Completed: 'completed',
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
  const [newDeliveryRequest, setNewDeliveryRequest] = useState<Delivery | null>(null);
  const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>([]);
  const [dailyPerformance, setDailyPerformance] = useState<DailyPerformance>({
    earnings: 0,
    deliveries: 0,
    rating: 0,
  });

  const courierEmail = 'courier@example.com'; // Replace this with dynamic value

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const pastRes = await fetch(`http://localhost:8080/api/courier/${courierEmail}/deliveries?type=PAST`, {
          credentials: 'include',
        });
        const pastData = await pastRes.json();
        setRecentDeliveries(pastData);

        const activeRes = await fetch(`http://localhost:8080/api/courier/${courierEmail}/deliveries?type=ACTIVE`, {
          credentials: 'include',
        });
        const activeData = await activeRes.json();
        if (activeData.length > 0) {
          setCurrentDelivery(activeData[0]);
        }
      } catch (error) {
        console.error('Failed to fetch deliveries:', error);
      }
    };

    fetchDeliveries();
  }, [courierEmail]);

  useEffect(() => {
    const calculateDailyPerformance = () => {
      const totalEarnings = recentDeliveries.reduce((sum, d) => sum + d.amount, 0);
      const avgRating =
        recentDeliveries.reduce((sum, d) => sum + (d.rating || 0), 0) / (recentDeliveries.length || 1);

      setDailyPerformance({
        earnings: parseFloat(totalEarnings.toFixed(2)),
        deliveries: recentDeliveries.length,
        rating: parseFloat(avgRating.toFixed(1)),
      });
    };

    calculateDailyPerformance();
  }, [recentDeliveries]);

  const acceptDelivery = () => {
    if (newDeliveryRequest) {
      const accepted = { ...newDeliveryRequest, status: 'accepted' as DeliveryStatus };
      setCurrentDelivery(accepted);
      setNewDeliveryRequest(null);
    }
  };

  const rejectDelivery = () => {
    setNewDeliveryRequest(null);
  };

  const markAsPickedUp = async () => {
    if (currentDelivery) {
      const updated = { ...currentDelivery, status: 'picked_up' as DeliveryStatus };
      try {
        await fetch(`http://localhost:8080/api/courier/${courierEmail}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            ...updated,
            status: statusToBackend[updated.status],
          }),
        });
        setCurrentDelivery(updated);
      } catch (err) {
        console.error('Failed to mark as picked up', err);
      }
    }
  };

  const markAsDelivered = async () => {
    if (currentDelivery) {
      const completed: Delivery = {
        ...currentDelivery,
        status: 'completed' as DeliveryStatus,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rating: 5.0,
      };

      try {
        await fetch(`http://localhost:8080/api/courier/${courierEmail}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            ...completed,
            status: statusToBackend[completed.status],
          }),
        });

        setRecentDeliveries(prev => [completed, ...prev]);
        setCurrentDelivery(null);
      } catch (err) {
        console.error('Failed to mark as delivered', err);
      }
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
        markAsDelivered,
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
