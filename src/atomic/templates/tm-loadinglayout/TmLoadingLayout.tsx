import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const TmLoadingLayout: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" color="text.secondary">
        Cargando...
      </Typography>
    </Box>
  )
}

export default TmLoadingLayout 