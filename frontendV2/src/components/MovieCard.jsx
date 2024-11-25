import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import { grey } from "@mui/material/colors";
import { toast } from "react-toastify"; // Toast imported but no ToastContainer
import api from "../api"; // Ensure this is the correct path to your API instance


const MovieCard = React.memo(({ movieId, title, image, description }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/api/favorites/");
        const favoriteMovies = response.data.map((fav) => fav.movie.id);
        setIsFavorite(favoriteMovies.includes(movieId));
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      }
    };

    const fetchWishlist = async () => {
      try {
        const response = await api.get("/api/wishlist/");
        const wishlistMovies = response.data.map((wish) => wish.movie.id);
        setIsBookmarked(wishlistMovies.includes(movieId));
      } catch (error) {
        console.error("Error fetching wishlist movies:", error);
      }
    };

    fetchFavorites();
    fetchWishlist();
  }, [movieId]);

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/api/favorites/${movieId}/remove/`);
        setIsFavorite(false);
        toast.info("Removed from favorites", {
          position: "bottom-right"
        });
      } else {
        await api.post(`/api/favorites/${movieId}/add/`);
        setIsFavorite(true);
        toast.success("Added to favorites", {
          position: "bottom-right"
        });
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Error updating favorite status", {
        position: "bottom-right"
      });
    }
  };

  const handleBookmarkClick = async () => {
    try {
      if (isBookmarked) {
        await api.delete(`/api/wishlist/${movieId}/remove/`);
        setIsBookmarked(false);
        toast.info("Removed from wishlist", {
          position: "bottom-right"
        });
      } else {
        await api.post(`/api/wishlist/${movieId}/add/`);
        setIsBookmarked(true);
        toast.success("Added to wishlist", {
          position: "bottom-right"
        });
      }
    } catch (error) {
      console.error("Error updating wishlist status:", error);
      toast.error("Error updating wishlist status", {
        position: "bottom-right"
      });
    }
  };

  return (
    <Card sx={{ maxWidth: 345, minHeight: 300, backgroundColor: grey[900] }}>
      <CardMedia
        component="img"
        image={image}
        sx={{
          width: "100%",
          height: 200,
          objectFit: "cover",
        }}
        alt={title}
      />
      <CardContent sx={{ maxHeight: 100, overflow: "hidden" }}>
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
            color: grey[50],
          }}
          gutterBottom
          variant="h5"
          component="div"
        >
          {title}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ maxHeight: 40 }}>
        <IconButton
          aria-label="add to favorites"
          onClick={handleFavoriteClick}
          sx={{
            color: isFavorite ? "red" : "white",
          }}
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton
          aria-label="bookmark"
          onClick={handleBookmarkClick}
          sx={{
            color: isBookmarked ? "gold" : "white",
          }}
        >
          <BookmarkOutlinedIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
});

export default MovieCard;
