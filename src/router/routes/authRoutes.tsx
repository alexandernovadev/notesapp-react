import React, { Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/router/layouts/AuthLayout'
import { Box, CircularProgress } from '@mui/material'

// Lazy load auth pages
const LoginPage = React.lazy(() => 
  import('@/router/pages/auth/LoginPage').then(module => ({
    default: module.LoginPage
  }))
)

const RegisterPage = React.lazy(() => 
  import('@/router/pages/auth/RegisterPage').then(module => ({
    default: module.RegisterPage
  }))
)

const ForgotPasswordPage = React.lazy(() => 
  import('@/router/pages/auth/ForgotPasswordPage').then(module => ({
    default: module.ForgotPasswordPage
  }))
)

// Loading component
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}
  >
    <CircularProgress size={60} thickness={4} sx={{ color: 'white' }} />
  </Box>
)

export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route 
          path="login" 
          element={
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          } 
        />
        <Route 
          path="register" 
          element={
            <Suspense fallback={<PageLoader />}>
              <RegisterPage />
            </Suspense>
          } 
        />
        <Route 
          path="forgot-password" 
          element={
            <Suspense fallback={<PageLoader />}>
              <ForgotPasswordPage />
            </Suspense>
          } 
        />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Route>
    </Routes>
  )
} 