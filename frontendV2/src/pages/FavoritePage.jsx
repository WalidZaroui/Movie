import React, { useEffect, useState } from 'react';
import api from '../api';
import FavoriteMovieCard from '../components/FavoriteMovieCard';
import NavbarComponent from "../components/NavbarComponent";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/api/favorites/');
      setFavorites(response.data);
    } catch (error) {
      setError('Failed to fetch favorites');
      console.error('Failed to fetch favorites', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/api/favorites/${id}/remove/`);
      setFavorites(prevFavorites => prevFavorites.filter(favorite => favorite.id !== id)); // Update state to trigger re-render
    } catch (error) {
      console.error('Failed to remove favorite', error);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <NavbarComponent />
      <h1 className='grid text-4xl text-white justify-items-center py-9'>My Favorites</h1>
      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : favorites.length === 0 ? (
        <p className="text-white text-center">No favorites</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((favorite) => (
            <FavoriteMovieCard key={favorite.id} movie={favorite.movie} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;