import React, { useEffect, useState } from 'react';
import api from '../api'; // Import the configured axios instance

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/api/movies/');
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
        alert('Error fetching movies, please try again later.');
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div>Loading movies...</div>; // Loading message
  }

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {movies.map((movie) => (
        <div key={movie.id} className="bg-gray-800 text-white p-4 rounded shadow hover:shadow-lg transform transition duration-300 ease-in-out">
          <img
            src={movie.image || 'path/to/default-image.jpg'} // Default image fallback
            alt={movie.title}
            className="w-full h-64 object-cover mb-4"
          />
          <h2 className="text-xl font-bold">{movie.title}</h2>
          <p>{movie.synopsis}</p>
          <p className="mt-2">Director: {movie.director}</p>
          <p>Rating: {movie.rating}</p>
          <p>Release Year: {movie.release_year}</p>
        </div>
      ))}
    </div>
  );
};

export default MoviePage;
