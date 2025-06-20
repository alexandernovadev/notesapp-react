import React from "react"
import PropTypes from "prop-types"
import { Box } from "@mui/material"

const ImageGallery = ({ images }) => {
  if (!images || images.length === 0) return null

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr" },
        gap: 2,
        mt: 2,
      }}
    >
      {images.map((url, idx) => (
        <Box
          key={idx}
          component="img"
          src={url}
          alt={`Nota imagen ${idx + 1}`}
          sx={{
            width: "100%",
            height: 140,
            objectFit: "cover",
            borderRadius: 2,
            boxShadow: 2,
          }}
        />
      ))}
    </Box>
  )
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
}

export default ImageGallery 