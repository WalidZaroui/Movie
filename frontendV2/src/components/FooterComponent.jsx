import React from 'react';

const FooterComponent = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <p>
          <a href="/privacy-policy" className="text-red-500 hover:underline">Privacy Policy</a> | 
          <a href="/terms-of-service" className="text-red-500 hover:underline ml-2">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default FooterComponent;