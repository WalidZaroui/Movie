import React from 'react';
import NavbarComponent from "../components/NavbarComponent";

const Watch = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <NavbarComponent />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-white">Watch Movie</h1>
        <div className="flex justify-center">
          <iframe
            width="1080"
            height="720"
            src="https://www.youtube.com/embed/FZGh3GGrEBA"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Watch;