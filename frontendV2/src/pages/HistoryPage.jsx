import React, { useEffect, useState } from "react";
import api from "../api";
import MediaControlCard from "../components/MediaControlCard";
import NavbarComponent from "../components/NavbarComponent";
import FooterComponent from "../components/FooterComponent";


const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch history data
  const fetchHistory = async () => {
    try {
      const response = await api.get("/api/history/"); // Assuming history endpoint
      setHistory(response.data);
    } catch (error) {
      setError("Failed to fetch history");
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle remove from history (e.g., a delete button)
  const handleRemove = async (id) => {
    try {
      await api.delete(`/api/history/${id}/remove/`);
      setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id)); 
    } catch (error) {
      console.error("Failed to remove history item", error);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <NavbarComponent />
      <h1 className="grid text-4xl text-white justify-items-center py-9">
        My History
      </h1>
      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-white text-center">No history</p>
      ) : (
        <div className="history-list ">
          {history.map((item) => (
            <MediaControlCard
              key={item.id}
              movie={{
                title: item.movie.title, // Title of the movie
                synopsis: item.movie.synopsis, // Description of the movie
                image: item.movie.image, // Image URL of the movie
              }}
              onRemove={() => handleRemove(item.id)} // Function to remove movie from history
            />
          ))}
        </div>
      )}
      
    </div>
  );
};

export default HistoryPage;
