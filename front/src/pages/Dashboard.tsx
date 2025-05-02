import React from 'react';
import Header from '../components/Header';
import DeliveryRequest from '../components/DeliveryRequest';
import CurrentDelivery from '../components/CurrentDelivery';
import PerformanceSummary from '../components/PerformanceSummary';
import RecentDeliveries from '../components/RecentDeliveries';
import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto max-w-4xl p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <DeliveryRequest />
            <CurrentDelivery />
          </div>
          
          <div>
            <PerformanceSummary />
            <RecentDeliveries />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;