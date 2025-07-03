import { useEffect, useRef } from "react"
import { useAuthStore } from "@/stores/useAuthStore"
import { onAuthStateChanged } from "firebase/auth"
import { FirebaseAuth } from "@/firebase/config"
import type { User as FirebaseUser } from "firebase/auth"

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
    login,
    logout,
  } = useAuthStore()

  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Solo configurar el listener una vez
    if (!unsubscribeRef.current) {
      unsubscribeRef.current = onAuthStateChanged(
        FirebaseAuth,
        (user: FirebaseUser | null) => {
          if (user) {
            login({
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName,
              photoURL: user.photoURL,
            })
          } else {
            logout()
          }
        }
      )
    }

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, []) // Sin dependencias para evitar re-renders

  const isAuthenticated = status === "authenticated"
  const isChecking = status === "checking"

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
