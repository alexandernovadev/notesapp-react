import { create } from 'zustand'
import { AuthState, User } from '@/types'
import { FirebaseAuth } from '@/firebase/config'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth'

interface AuthStore extends AuthState {
  login: (user: User) => void
  logout: (errorMessage?: string | null) => void
  checkingCredentials: () => void
  startLoginWithEmailPassword: (email: string, password: string) => Promise<void>
  startLogout: () => Promise<void>
  startUpdateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
  checkAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  status: 'checking',
  uid: null,
  email: null,
  displayName: null,
  photoURL: null,
  errorMessage: null,

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

  startLoginWithEmailPassword: async (email, password) => {
    set({ status: 'checking' })
    try {
      const res = await signInWithEmailAndPassword(FirebaseAuth, email, password)
      const user = res.user
      set({
        status: 'authenticated',
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        errorMessage: null,
      })
    } catch (error: any) {
      set({
        status: 'not-authenticated',
        errorMessage: error.message || 'Error de autenticación',
      })
    }
  },

  startLogout: async () => {
    await signOut(FirebaseAuth)
    set({
      status: 'not-authenticated',
      uid: null,
      email: null,
      displayName: null,
      photoURL: null,
      errorMessage: null,
    })
  },

  startUpdateUserProfile: async (data) => {
    const user = FirebaseAuth.currentUser
    if (!user) return
    await updateProfile(user, data)
    set((state) => ({
      displayName: data.displayName ?? state.displayName,
      photoURL: data.photoURL ?? state.photoURL,
    }))
  },

  checkAuth: () => {
    set({ status: 'checking' })
    onAuthStateChanged(FirebaseAuth, (user: FirebaseUser | null) => {
      if (user) {
        set({
          status: 'authenticated',
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          errorMessage: null,
        })
      } else {
        set({
          status: 'not-authenticated',
          uid: null,
          email: null,
          displayName: null,
          photoURL: null,
          errorMessage: null,
        })
      }
    })
  },
})) 