import React, { useEffect, useState } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import NavbarComponent from "../components/NavbarComponent";
import FooterComponent from "../components/FooterComponent";
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get(`/api/movies/${id}/`);
        setMovie(response.data);
      } catch (error) {
        setError('Failed to fetch movie details');
        console.error('Failed to fetch movie details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Calculate the number of stars based on the rating
  const fullStars = Math.floor(movie.rating / 2);
  const halfStar = movie.rating % 2 >= 1 ? 1 : 0;

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <NavbarComponent />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          {/* Movie Image */}
          <div className="w-full md:w-1/2 px-4 mb-8">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-auto rounded-lg shadow-md mb-4"
            />
          </div>

          {/* Movie Details */}
          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold mb-4 text-white">{movie.title}</h2>
            <div className="flex items-center mb-4">
              {[...Array(fullStars)].map((_, index) => (
                <FaStar key={index} className="text-yellow-500" />
              ))}
              {halfStar === 1 && <FaStarHalfAlt className="text-yellow-500" />}
              {[...Array(5 - fullStars - halfStar)].map((_, index) => (
                <FaStar key={index} className="text-gray-600" />
              ))}
              <span className="ml-2 text-gray-400">{movie.rating}/10</span>
            </div>
            <p className="text-gray-400 mb-4">Release Year: {movie.release_year}</p>
            <p className="text-gray-400 mb-4">Director: {movie.director}</p>
            <p className="text-gray-300 mb-6">{movie.synopsis}</p>
            {movie.youtube_url && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Trailer:</h3>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${new URL(movie.youtube_url).searchParams.get('v')}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-64 md:h-96"
                ></iframe>
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-white">Genres:</h3>
              <ul className="list-disc list-inside text-gray-300 grid grid-cols-2 lg:grid-cols-4 gap-2">
                {movie.genres.map((genre, index) => (
                  <li key={index}>{genre.name}</li>
                ))}
              </ul>
            </div>
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => navigate(`/watch/${id}`)}
            >
              Watch Movie
            </button>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default MovieDetail;