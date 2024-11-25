import React from 'react';
import api from '../api';

const WishlistMovieCard = ({ movie, onRemove }) => {
  const handleRemove = async () => {
    try {
      await api.delete(`/api/wishlist/${movie.id}/remove/`);
      onRemove(movie.id); // Call the onRemove function passed as a prop
    } catch (error) {
      console.error('Failed to remove from wishlist', error);
    }
  };

  return (
    <div className="flex justify-center py-6">
      <div className="flex max-w-full sm:max-w-lg bg-white shadow-lg rounded-lg overflow-hidden w-full">
        <div
          className="w-1/3 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.image})` }}
        ></div>
        <div className="w-2/3 p-4">
          <h1 className="text-gray-900 font-bold text-2xl">{movie.title}</h1>
          <div className="flex item-center mt-2">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-5 h-5 fill-current ${
                  index < Math.floor(movie.rating / 2) ? 'text-gray-700' : 'text-gray-500'
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
              </svg>
            ))}
          </div>
          <div className="flex item-center justify-between mt-3">
            <h1 className="text-gray-700 font-bold text-xl">{movie.release_year}</h1>
            <button
              onClick={handleRemove}
              className="px-3 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistMovieCard;