import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import type { RegisterArgs, UpdateProfileArgs } from '@/firebase/providers'

export const useAuth = () => {
  const {
    status,
    uid,
    email,
    displayName,
    photoURL,
    errorMessage,
    startLoginWithEmailPassword,
    startRegisterWithEmailPassword,
    startLoginWithGoogle,
    startLogout,
    startUpdateUserProfile,
    startResetPassword,
    setError,
    clearError,
    checkAuth,
  } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const isAuthenticated = status === 'authenticated'
  const isChecking = status === 'checking'

  return {
    // State
    status,
    uid,
    email,
    displayName,
    photoURL,
    errorMessage,
    isAuthenticated,
    isChecking,
    
    // Actions
    login: startLoginWithEmailPassword,
    register: startRegisterWithEmailPassword,
    loginWithGoogle: startLoginWithGoogle,
    logout: startLogout,
    updateProfile: startUpdateUserProfile,
    resetPassword: startResetPassword,
    setError,
    clearError,
  }
} 