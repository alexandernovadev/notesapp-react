import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'

export const useCheckAuth = () => {
  const { status, checkAuth } = useAuthStore()
  
  useEffect(() => {
    // Inicializar la verificación de autenticación
    checkAuth()
  }, [checkAuth])
  
  return status
} 