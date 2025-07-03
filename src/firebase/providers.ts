import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from "firebase/auth"
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  serverTimestamp 
} from "firebase/firestore"
import { FirebaseAuth, FirebaseDB } from "./config"
import { translateFirebaseError } from "@/utils/firebaseErrors"
import type { UserProfile, ProfileUpdateData, UserPreferences, UserStats } from "@/types"

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
      errorMessage: translateFirebaseError(error.message),
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
    return { ok: false, errorMessage: translateFirebaseError(error.message) }
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
    return { ok: false, errorMessage: translateFirebaseError(error.message) }
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
    return { ok: false, errorMessage: translateFirebaseError(error.message) }
  }
}

// Extended Profile Services
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(FirebaseDB, `users/${uid}`)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile
    }
    return null
  } catch (error: any) {
    console.error('Error getting user profile:', error)
    return null
  }
}

export const createUserProfile = async (userProfile: UserProfile): Promise<AuthResponse> => {
  try {
    const docRef = doc(FirebaseDB, `users/${userProfile.uid}`)
    await setDoc(docRef, {
      ...userProfile,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    })
    return { ok: true }
  } catch (error: any) {
    return { ok: false, errorMessage: translateFirebaseError(error.message) }
  }
}

export const updateUserProfileExtended = async (
  uid: string, 
  profileData: ProfileUpdateData
): Promise<AuthResponse> => {
  try {
    const docRef = doc(FirebaseDB, `users/${uid}`)
    
    // Update Firebase Auth profile if displayName or photoURL changed
    if (profileData.displayName !== undefined || profileData.photoURL !== undefined) {
      await updateProfile(FirebaseAuth.currentUser as User, {
        displayName: profileData.displayName ?? null,
        photoURL: profileData.photoURL ?? null,
      })
    }
    
    // Update Firestore profile
    await updateDoc(docRef, {
      ...profileData,
      lastLoginAt: serverTimestamp(),
    })
    
    return { ok: true }
  } catch (error: any) {
    return { ok: false, errorMessage: translateFirebaseError(error.message) }
  }
}

export const updateUserPreferences = async (
  uid: string, 
  preferences: Partial<UserPreferences>
): Promise<AuthResponse> => {
  try {
    const docRef = doc(FirebaseDB, `users/${uid}`)
    await updateDoc(docRef, {
      preferences: preferences,
    })
    return { ok: true }
  } catch (error: any) {
    return { ok: false, errorMessage: translateFirebaseError(error.message) }
  }
}

export const calculateUserStats = async (uid: string): Promise<UserStats> => {
  try {
    const notesRef = collection(FirebaseDB, `${uid}/journal/notes`)
    const notesSnapshot = await getDocs(notesRef)
    
    const notes = notesSnapshot.docs.map(doc => doc.data())
    const now = Date.now()
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000)
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000)
    
    const stats: UserStats = {
      totalNotes: notes.length,
      totalWords: notes.reduce((sum, note) => sum + (note.wordCount || 0), 0),
      totalReadingTime: notes.reduce((sum, note) => sum + (note.readTime || 0), 0),
      favoriteNotes: notes.filter(note => note.isFavorite).length,
      categoriesUsed: [...new Set(notes.map(note => note.category).filter(Boolean))],
      tagsUsed: [...new Set(notes.flatMap(note => note.tags || []))],
      averageNoteLength: notes.length > 0 ? Math.round(notes.reduce((sum, note) => sum + (note.wordCount || 0), 0) / notes.length) : 0,
      mostUsedCategory: getMostUsedCategory(notes),
      createdThisWeek: notes.filter(note => note.createdAt > weekAgo).length,
      createdThisMonth: notes.filter(note => note.createdAt > monthAgo).length,
      lastActiveDate: Math.max(...notes.map(note => note.updatedAt || note.createdAt)),
    }
    
    // Update stats in Firestore
    const userRef = doc(FirebaseDB, `users/${uid}`)
    await updateDoc(userRef, { stats })
    
    return stats
  } catch (error: any) {
    console.error('Error calculating user stats:', error)
    return {}
  }
}

const getMostUsedCategory = (notes: any[]): string => {
  const categoryCount: { [key: string]: number } = {}
  
  notes.forEach(note => {
    if (note.category) {
      categoryCount[note.category] = (categoryCount[note.category] || 0) + 1
    }
  })
  
  let mostUsedCategory = ''
  let maxCount = 0
  
  Object.entries(categoryCount).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count
      mostUsedCategory = category
    }
  })
  
  return mostUsedCategory
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
      errorMessage: translateFirebaseError(error.message),
    }
  }
}
