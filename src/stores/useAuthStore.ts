import { create } from 'zustand'
import { AuthState, User } from '@/types'

import {
  loginWithEmailPassword,
  registerUserWithEmailPassword,
  singInWithGoogle,
  logoutFirebase,
  updateUserProfile,
  resetPassword,
  type AuthResponse,
  type RegisterArgs,
  type UpdateProfileArgs,
} from '@/firebase/providers'

interface AuthStore extends AuthState {
  // State setters
  login: (user: User) => void
  logout: (errorMessage?: string | null) => void
  checkingCredentials: () => void
  setError: (errorMessage: string | null) => void
  clearError: () => void
  
  // Auth actions
  startLoginWithEmailPassword: (email: string, password: string) => Promise<AuthResponse>
  startRegisterWithEmailPassword: (args: RegisterArgs) => Promise<AuthResponse>
  startLoginWithGoogle: () => Promise<AuthResponse>
  startLogout: () => Promise<void>
  startUpdateUserProfile: (data: UpdateProfileArgs) => Promise<AuthResponse>
  startResetPassword: (email: string) => Promise<AuthResponse>
  

}

export const useAuthStore = create<AuthStore>((set) => ({
  status: 'checking',
  uid: null,
  email: null,
  displayName: null,
  photoURL: null,
  errorMessage: null,

  // State setters
  login: (user) => set({
    status: 'authenticated',
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    errorMessage: null,
  }),

  logout: (errorMessage = null) => set({
    status: 'not-authenticated',
    uid: null,
    email: null,
    displayName: null,
    photoURL: null,
    errorMessage,
  }),

  checkingCredentials: () => set({ status: 'checking' }),

  setError: (errorMessage) => set({ errorMessage }),

  clearError: () => set({ errorMessage: null }),

  // Auth actions
  startLoginWithEmailPassword: async (email, password) => {
    // Solo limpiar el error, no cambiar el status a checking
    set({ errorMessage: null })
    
    const response = await loginWithEmailPassword({ email, password })
    
    if (response.ok && response.uid) {
      set({
        status: 'authenticated',
        uid: response.uid,
        email: response.email ?? null,
        displayName: response.displayName ?? null,
        photoURL: response.photoURL ?? null,
        errorMessage: null,
      })
    } else {
      set({
        status: 'not-authenticated',
        errorMessage: response.errorMessage || 'Error de autenticación',
      })
    }
    
    return response
  },

  startRegisterWithEmailPassword: async (args) => {
    // Solo limpiar el error, no cambiar el status a checking
    set({ errorMessage: null })
    
    const response = await registerUserWithEmailPassword(args)
    
    if (response.ok && response.uid) {
      set({
        status: 'authenticated',
        uid: response.uid,
        email: response.email ?? null,
        displayName: response.displayName ?? null,
        photoURL: response.photoURL ?? null,
        errorMessage: null,
      })
    } else {
      set({
        status: 'not-authenticated',
        errorMessage: response.errorMessage || 'Error de registro',
      })
    }
    
    return response
  },

  startLoginWithGoogle: async () => {
    // Solo limpiar el error, no cambiar el status a checking
    set({ errorMessage: null })
    
    const response = await singInWithGoogle()
    
    if (response.ok && response.uid) {
      set({
        status: 'authenticated',
        uid: response.uid,
        email: response.email ?? null,
        displayName: response.displayName ?? null,
        photoURL: response.photoURL ?? null,
        errorMessage: null,
      })
    } else {
      set({
        status: 'not-authenticated',
        errorMessage: response.errorMessage || 'Error de autenticación con Google',
      })
    }
    
    return response
  },

  startLogout: async () => {
    try {
      await logoutFirebase()
      set({
        status: 'not-authenticated',
        uid: null,
        email: null,
        displayName: null,
        photoURL: null,
        errorMessage: null,
      })
    } catch (error: any) {
      set({
        errorMessage: error.message || 'Error al cerrar sesión',
      })
    }
  },

  startUpdateUserProfile: async (data) => {
    const response = await updateUserProfile(data)
    
    if (response.ok) {
      set((state) => ({
        displayName: data.displayName ?? state.displayName,
        photoURL: data.photoURL ?? state.photoURL,
        errorMessage: null,
      }))
    } else {
      set({
        errorMessage: response.errorMessage || 'Error al actualizar perfil',
      })
    }
    
    return response
  },

  startResetPassword: async (email) => {
    set({ errorMessage: null })
    
    const response = await resetPassword({ email })
    
    if (!response.ok) {
      set({
        errorMessage: response.errorMessage || 'Error al enviar email de recuperación',
      })
    }
    
    return response
  },
})) 