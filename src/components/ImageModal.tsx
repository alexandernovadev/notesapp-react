import React from 'react'
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  LinearProgress,
} from '@mui/material'
import {
  Close as CloseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material'

interface ImageModalProps {
  open: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onImageChange: (index: number) => void
}

export const ImageModal: React.FC<ImageModalProps> = ({
  open,
  onClose,
  images,
  currentIndex,
  onImageChange,
}) => {
  const [zoom, setZoom] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(true)

  const currentImage = images[currentIndex]

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onImageChange(currentIndex - 1)
      setZoom(1)
    }
  }

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onImageChange(currentIndex + 1)
      setZoom(1)
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5))
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
  }

  React.useEffect(() => {
    if (open) {
      setZoom(1)
      setIsLoading(true)
    }
  }, [open, currentIndex])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          maxWidth: '95vw',
          maxHeight: '95vh',
          width: 'auto',
          height: 'auto',
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white' }}>
            {currentIndex + 1} de {images.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleZoomOut} sx={{ color: 'white' }}>
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={handleZoomIn} sx={{ color: 'white' }}>
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Loading */}
        {isLoading && (
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5 }}>
            <LinearProgress sx={{ width: 200 }} />
          </Box>
        )}

        {/* Image Container */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            position: 'relative',
          }}
        >
          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: 10,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>
          )}

          {currentIndex < images.length - 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: 10,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          )}

          {/* Image */}
          <img
            src={currentImage}
            alt={`Imagen ${currentIndex + 1}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              transform: `scale(${zoom})`,
              transition: 'transform 0.3s ease',
            }}
          />
        </Box>

        {/* Thumbnails */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              justifyContent: 'center',
            }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                onClick={() => onImageChange(index)}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: index === currentIndex ? '2px solid white' : '2px solid transparent',
                  opacity: index === currentIndex ? 1 : 0.7,
                  transition: 'all 0.2s',
                  '&:hover': { opacity: 1 },
                }}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
} 