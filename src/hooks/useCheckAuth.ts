import { useAuthStore } from '@/stores/useAuthStore'

export const useCheckAuth = () => {
  const { status } = useAuthStore()
  
  // El hook useAuth ya maneja el checkAuth en su useEffect
  // Este hook solo retorna el status para compatibilidad
  return status
} 