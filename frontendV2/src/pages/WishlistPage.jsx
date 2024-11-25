import React, { useEffect, useState } from 'react';
import api from '../api';
import WishlistMovieCard from '../components/WishlistMovieCard ';
import NavbarComponent from "../components/NavbarComponent";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/api/wishlist/');
      setWishlist(response.data);
    } catch (error) {
      setError('Failed to fetch wishlist');
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/api/wishlist/${id}/remove/`);
      window.location.reload(); // Refresh the page after deletion
    } catch (error) {
      console.error('Failed to remove from wishlist', error);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <NavbarComponent />
      <h1 className='grid text-4xl text-white justify-items-center py-9'>My Wishlist</h1>
      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : wishlist.length === 0 ? (
        <p className="text-white text-center">No items in wishlist</p>
      ) : (
        <div className="wishlist-list">
          {wishlist.map((item) => (
            <WishlistMovieCard key={item.id} movie={item.movie} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;