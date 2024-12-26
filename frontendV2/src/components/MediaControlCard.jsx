import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const MediaControlCard = ({ movie, onRemove }) => {
  const theme = useTheme();
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  const toggleSynopsis = () => {
    setShowFullSynopsis(!showFullSynopsis);
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="movie table">
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Title & Synopsis</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              <img src={movie.image} alt={movie.title} style={{ width: 151, height: 151 }} />
            </TableCell>
            <TableCell>
              <Typography component="div" variant="h5">
                {movie.title}
              </Typography>
              <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary' }}>
                {showFullSynopsis ? movie.synopsis : truncateText(movie.synopsis, 20)}
              </Typography>
              <Button onClick={toggleSynopsis} sx={{ textTransform: 'none' }}>
                {showFullSynopsis ? 'Show Less' : 'Show More'}
              </Button>
            </TableCell>
            <TableCell align="right">
              <IconButton aria-label="delete" onClick={onRemove}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MediaControlCard;