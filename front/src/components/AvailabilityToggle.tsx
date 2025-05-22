import React, { useState, useEffect } from 'react';

const AvailabilityToggle: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();  // Yükleme durumu

  // Fetch the current availability status when the component mounts
  useEffect(() => {
    const fetchAvailability = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch('http://localhost:8080/api/courier/me/availability', {
          method: 'GET',
          credentials: 'include',  // Include cookies for session-based auth
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setIsAvailable(data);  // Assuming the response contains the availability status
        } else {
          console.error('Failed to fetch availability:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setLoading(false);  // Veri alındıktan sonra yükleme durumu kapanır
      }
    };

    fetchAvailability();
  }, []);  // Yalnızca sayfa yüklendiğinde çalışacak


  // Handle availability toggle (POST request to update status)
  const toggleAvailability = async () => {
    const token = localStorage.getItem("token");
    try {
      const newAvailability = !isAvailable;
      setIsAvailable(newAvailability);  // Optimistic update

      const response = await fetch(`http://localhost:8080/api/courier/me/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        credentials: 'include',  // Include cookies for session-based auth
        body: JSON.stringify({ isAvailable: newAvailability }),  // Payload to update availability
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }
    } catch (error) {
      setIsAvailable(isAvailable);  // Revert optimistic update
      console.error('Error updating availability:', error);
    }
  };

  return (
    <button
      onClick={toggleAvailability}
      className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full px-4 py-1 shadow-sm hover:bg-gray-50 transition"
    >
      <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-black' : 'bg-gray-400'}`} />
      <span className="text-sm font-medium">
        {isAvailable ? 'Available' : 'Unavailable'}
      </span>
    </button>
  );
};

export default AvailabilityToggle;
