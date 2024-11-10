import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { grey } from '@mui/material/colors';
const MovieCard = React.memo(
  ({ title, subheader, image, description, avatarLetter }) => {
    // State to track if the button is clicked
    const [clicked, setClicked] = useState(false);

    // Toggle the 'clicked' state when the button is clicked
    const handleClick = () => {
      setClicked(!clicked);
    };

    return (
      <Card sx={{ maxWidth: 345, minHeight: 300 ,backgroundColor:grey[900]}}>
        <CardMedia
          component="img"
          image={image}
          sx={{
            width: "100%", // Ensures the image fills the width of the card
            height: 200, // Sets a consistent height for all images
            objectFit: "cover", // Ensures the image covers the area while maintaining its aspect ratio
          }}
          alt={title}
        />
        <CardContent sx={{ maxHeight: 100, overflow: "hidden" }}>
          
            <Typography
              sx={{
                display: "-webkit-box", // Create a flexbox for multiline truncation
                WebkitBoxOrient: "vertical", // Enable vertical orientation for the box
                overflow: "hidden", // Hide overflowing content
                WebkitLineClamp: 1, // Limit to 2 lines and add ellipsis after that
                textOverflow: "ellipsis", // Add ellipsis if text overflows
                color:grey[50]
            }}
              gutterBottom
              variant="h5"
              component="div"
            >
              {title}
            </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{maxHeight:40}}>
          <IconButton
            aria-label="add to favorites"
            onClick={handleClick}
            sx={{
              color: clicked ? "red" : "white", // Change color based on the clicked state
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
