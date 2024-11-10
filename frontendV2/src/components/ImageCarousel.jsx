import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Box, Typography, Button } from "@mui/material";
import image1 from "../assets/img/img11.jpg";
import image2 from "../assets/img/img12.jpg";
import image3 from "../assets/img/img13.jpg";

function ImageCarousel() {
  return (
    <Box className="relative w-full h-[500px]">
      {/* Carousel for sliding images */}
      <Carousel
        infiniteLoop
        autoPlay
        interval={3000}
        showThumbs={false}
        showStatus={false}
        emulateTouch
        stopOnHover={false}
        swipeable={true}
        transitionTime={1000} // Adjust transition duration for smoothness
        className="h-full"
      >
        <div className="relative">
          <img
            src={image1}
            alt="Slide 1"
            className="w-full h-[500px] object-cover opacity-40 transition-opacity duration-1000"
          />
        </div>
        <div className="relative">
          <img
            src={image2}
            alt="Slide 2"
            className="w-full h-[500px] object-cover opacity-40 transition-opacity duration-1000"
          />
        </div>
        <div className="relative">
          <img
            src={image3}
            alt="Slide 3"
            className="w-full h-[500px] object-cover opacity-40 transition-opacity duration-1000"
          />
        </div>
      </Carousel>

      {/* Fixed welcome message overlay */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start p-8 bg-opacity-0">
        <div className="text-white text-6xl font-bold">
          <h1 className="mb-4">Welcome to DhiaFlix</h1>
          <button className="px-4 py-4 bg-red-500 text-4xl text-white rounded hover:bg-red-700">
            Watch Now
          </button>
        </div>
      </div>
    </Box>
  );
}

export default ImageCarousel;
