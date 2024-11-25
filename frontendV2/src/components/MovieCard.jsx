import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { grey } from '@mui/material/colors';
import api from '../api'; // Ensure this is the correct path to your api instance

const MovieCard = React.memo(
  ({ movieId, title, image, description }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
      const fetchFavorites = async () => {
        try {
          const response = await api.get('/api/favorites/');
          const favoriteMovies = response.data.map(fav => fav.movie.id);
          console.log('Fetched favorites:', favoriteMovies);
          setIsFavorite(favoriteMovies.includes(movieId));
        } catch (error) {
          console.error('Error fetching favorite movies:', error);
        }
      };

      fetchFavorites();
    }, [movieId]);

    const handleFavoriteClick = async () => {
      try {
        console.log(`Current favorite status: ${isFavorite}`);
        if (isFavorite) {
          const response = await api.delete(`/api/favorites/${movieId}/remove/`);
          console.log(`Removed movie ${movieId} from favorites`, response);
        } else {
          const response = await api.post(`/api/favorites/${movieId}/add/`);
          console.log(`Added movie ${movieId} to favorites`, response);
        }
        setIsFavorite(!isFavorite);
      } catch (error) {
        console.error('Error updating favorite status:', error);
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
              color: grey[50]
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
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
);

export default MovieCard;