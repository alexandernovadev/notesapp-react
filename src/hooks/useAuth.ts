import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'

export const useAuth = () => {
  const {
    status,
    uid,
    email,
    displayName,
    photoURL,
    errorMessage,
    startLoginWithEmailPassword,
    startLogout,
    startUpdateUserProfile,
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
    logout: startLogout,
    updateProfile: startUpdateUserProfile,
  }
} 