import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-black  flex-col">
      <h1 className="text-9xl font-bold text-red-800">404</h1>
      <p className="text-4xl mt-4 text-red-800">Page Not Found</p>
      <p className="text-lg mt-2 text-white">Redirecting to the home page in {countdown} seconds...</p>
    </div>
  );
};

export default NotFound;
