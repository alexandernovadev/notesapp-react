import React from "react"
import { Box, CircularProgress, Typography } from "@mui/material"

interface LoadingLayoutProps {
  message?: string
  size?: number
}

const LoadingLayout: React.FC<LoadingLayoutProps> = ({
  message = "Cargando...",
  size = 60,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={size} thickness={4} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

export default LoadingLayout
