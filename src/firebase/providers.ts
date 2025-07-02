import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from "firebase/auth"
import { FirebaseAuth } from "./config"

const googleProvider = new GoogleAuthProvider()

export interface AuthResponse {
  ok: boolean
  displayName?: string | null
  email?: string | null
  photoURL?: string | null
  uid?: string
  errorMessage?: string
}

export interface RegisterArgs {
  email: string
  password: string
  displayName: string
}

export interface LoginArgs {
  email: string
  password: string
}

export interface UpdateProfileArgs {
  displayName?: string
  photoURL?: string
}

export interface ResetPasswordArgs {
  email: string
}

export const singInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    const result = await signInWithPopup(FirebaseAuth, googleProvider)
    const { displayName, email, photoURL, uid } = result.user
    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
    }
  } catch (error: any) {
    return {
      ok: false,
      errorMessage: error.message,
    }
  }
}

export const registerUserWithEmailPassword = async ({
  email,
  password,
  displayName,
}: RegisterArgs): Promise<AuthResponse> => {
  try {
    const resp = await createUserWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    )
    const { uid, photoURL } = resp.user
    await updateProfile(FirebaseAuth.currentUser as User, { displayName })
    return {
      ok: true,
      uid,
      photoURL,
      email,
      displayName,
    }
  } catch (error: any) {
    return { ok: false, errorMessage: error.message }
  }
}

export const loginWithEmailPassword = async ({
  email,
  password,
}: LoginArgs): Promise<AuthResponse> => {
  try {
    const resp = await signInWithEmailAndPassword(FirebaseAuth, email, password)
    const { uid, photoURL, displayName } = resp.user
    return {
      ok: true,
      uid,
      photoURL,
      displayName,
    }
  } catch (error: any) {
    return { ok: false, errorMessage: error.message }
  }
}

export const logoutFirebase = async (): Promise<void> => {
  return await FirebaseAuth.signOut()
}

export const updateUserProfile = async ({
  displayName,
  photoURL,
}: UpdateProfileArgs): Promise<AuthResponse> => {
  try {
    await updateProfile(FirebaseAuth.currentUser as User, {
      displayName: displayName ?? null,
      photoURL: photoURL ?? null,
    })
    return {
      ok: true,
      displayName: displayName ?? null,
      photoURL: photoURL ?? null,
    }
  } catch (error: any) {
    return { ok: false, errorMessage: error.message }
  }
}

export const resetPassword = async ({
  email,
}: ResetPasswordArgs): Promise<AuthResponse> => {
  try {
    await sendPasswordResetEmail(FirebaseAuth, email)
    return {
      ok: true,
      email,
    }
  } catch (error: any) {
    return {
      ok: false,
      errorMessage: error.message,
    }
  }
}
