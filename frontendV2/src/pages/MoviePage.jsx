import React, { useEffect, useState } from "react";
import api from "../api";
import MovieCard from "../components/MovieCard"; // Adjust the path as needed
import NavbarComponent from "../components/NavbarComponent";
import { toast,ToastContainer } from "react-toastify"; // ToastContainer imported here
import "react-toastify/dist/ReactToastify.css";
import LoadingMovie from "../components/LoadingMovie";

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [sortOrder, setSortOrder] = useState(null); // 'rating' or 'date'
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [moviesPerPage] = useState(8); // Number of movies to show per page

  useEffect(() => {
    const fetchMovies = async () => {
      // Simulate a 2-second delay before making the API request
      setTimeout(async () => {
        try {
          const response = await api.get("/api/movies/");
          setMovies(response.data);
        } catch (error) {
          console.error("Error fetching movies:", error);
          alert("Error fetching movies, please try again later.");
        } finally {
          setLoading(false); // Set loading to false after the movies are fetched
        }
      }, 1000); // 2-second delay
    };

    fetchMovies();
  }, []);

  // Sort movies based on selected criteria
  const sortMovies = (criteria) => {
    const sortedMovies = [...movies]; // Create a copy of the movies array to sort
    if (criteria === "rating") {
      sortedMovies.sort((a, b) => b.rating - a.rating); // Sort by rating in descending order
    } else if (criteria === "date") {
      sortedMovies.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ); // Sort by date in descending order
    }
    setMovies(sortedMovies);
    setSortOrder(criteria); // Set the active sorting criteria
  };

  // Handle the search filter
  const filteredMovies = movies.filter(
    (movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by title
  );

  // Paginate the filtered movies
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination Logic
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredMovies.length / moviesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Show the loading indicator until the data is loaded */}
      {loading ? (
        <LoadingMovie />
      ) : (
        <>
          <NavbarComponent />
          <ToastContainer  autoClose={1500} /> {/* Toast container for notifications */}
          <div className="p-8">
            {/* Search bar and sort buttons in the same line */}
            <div className="flex justify-between mb-4 items-center">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search movies by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                  className="px-4 py-2 rounded border border-gray-300"
                />
                <button
                  onClick={() => sortMovies("rating")}
                  className={`px-4 py-2 rounded ${
                    sortOrder === "rating" ? "bg-red-500" : "bg-gray-500"
                  }`}
                >
                  Sort by Rating
                </button>
                <button
                  onClick={() => sortMovies("date")}
                  className={`px-4 py-2 rounded ${
                    sortOrder === "date" ? "bg-red-500" : "bg-gray-500"
                  }`}
                >
                  Sort by Date
                </button>
              </div>
            </div>

            {/* Movie cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentMovies.length > 0 ? (
                currentMovies.map((movie) => (
                  <div
                    className="w-full max-w-sm mx-auto h-full max-h-screen"
                    key={movie.id}
                  >
                    <MovieCard
                      movieId={movie.id}
                      title={movie.title}
                      subheader={`Released: ${movie.release_year}`}
                      image={movie.image || "path/to/default-image.jpg"}
                      description={movie.synopsis}
                      avatarLetter={movie.title ? movie.title.charAt(0) : "M"}
                      createdAt={new Date(
                        movie.created_at
                      ).toLocaleDateString()} // Display the creation date
                    />
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center text-white h-full">
                  <p>No movies found</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
              <nav>
                <ul className="flex space-x-2">
                  {pageNumbers.map((number) => (
                    <li key={number}>
                      <button
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 rounded ${
                          currentPage === number ? "bg-red-500" : "bg-gray-500"
                        }`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MoviePage;
