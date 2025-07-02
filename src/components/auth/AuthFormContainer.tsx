import React from 'react'
import { Box } from '@mui/material'

interface AuthFormContainerProps {
  children: React.ReactNode
}

export const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ children }) => {
  return (
    <Box sx={{ padding: 3 }}>
      {children}
    </Box>
  )
} 