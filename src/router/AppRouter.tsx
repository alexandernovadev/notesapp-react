import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardRoutes } from './routes/dashboardRoutes'
import { AuthRoutes } from './routes/authRoutes'
import { useAuth } from '@/hooks/useAuth'
import { Box, CircularProgress, Typography } from '@mui/material'

export const AppRouter: React.FC = () => {
  const { status } = useAuth()

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
          Cargando aplicación...
        </Typography>
      </Box>
    )
  }

  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
          gap={2}
        >
          <CircularProgress size={50} thickness={4} />
          <Typography variant="body1" color="text.secondary">
            Cargando contenido...
          </Typography>
        </Box>
      }
    >
      <Routes>
        {/* Auth routes */}
        <Route path="/auth/*" element={<AuthRoutes />} />
        
        {/* Dashboard routes (protected) */}
        <Route path="/*" element={<DashboardRoutes />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
