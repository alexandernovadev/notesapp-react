import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/router/layouts/AuthLayout'

// Lazy load auth pages
const LoginPage = React.lazy(() => 
  import('@/router/pages/auth/LoginPage').then(module => ({
    default: module.LoginPage
  }))
)

export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Route>
    </Routes>
  )
} 