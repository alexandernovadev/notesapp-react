import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { Box, CircularProgress, Typography } from '@mui/material'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { status, uid } = useAuthStore()
  const location = useLocation()

  // Loading state
  if (status === 'checking') {
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
          Verificando autenticación...
        </Typography>
      </Box>
    )
  }

  // Not authenticated - redirect to login
  if (status === 'not-authenticated' || !uid) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // Authenticated - render children
  return <>{children}</>
} 