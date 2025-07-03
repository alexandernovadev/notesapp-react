import { useState, useEffect } from "react"
import { useAuthStore } from "@/stores/useAuthStore"
import {
  getUserProfile,
  createUserProfile,
  updateUserProfileExtended,
  updateUserPreferences,
  calculateUserStats,
} from "@/firebase/providers"
import type { UserProfile, ProfileUpdateData, UserPreferences } from "@/types"

interface UseUserProfileReturn {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>
  refreshStats: () => Promise<void>
  isUpdating: boolean
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { uid, email, displayName, photoURL } = useAuthStore()

  // Load user profile when component mounts or uid changes
  useEffect(() => {
    if (uid) {
      loadUserProfile()
    }
  }, [uid])

  const loadUserProfile = async () => {
    if (!uid) return

    setIsLoading(true)
    setError(null)

    try {
      let userProfile = await getUserProfile(uid)

      // If profile doesn't exist, create it
      if (!userProfile) {
        const newProfile: UserProfile = {
          uid,
          email: email || "",
          displayName,
          photoURL,
          bio: "",
          location: "",
          website: "",
          phoneNumber: "",
          occupation: "",
          company: "",
          preferences: {
            theme: "light",
            language: "es",
            emailNotifications: true,
            pushNotifications: true,
            autoSave: true,
            defaultNoteColor: "#f8fafc",
            defaultCategory: "Personal",
            editorFontSize: "medium",
            editorFontFamily: "Inter",
            compactMode: false,
            showWordCount: true,
            showReadingTime: true,
          },
          stats: {},
        }

        await createUserProfile(newProfile)
        userProfile = newProfile
      }

      setProfile(userProfile)
    } catch (err: any) {
      setError("Error al cargar el perfil del usuario")
      console.error("Error loading user profile:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: ProfileUpdateData): Promise<boolean> => {
    if (!uid) return false

    setIsUpdating(true)
    setError(null)

    try {
      const response = await updateUserProfileExtended(uid, data)

      if (response.ok) {
        // Update local profile state
        setProfile((prev) => (prev ? { ...prev, ...data } : null))
        return true
      } else {
        setError(response.errorMessage || "Error al actualizar el perfil")
        return false
      }
    } catch (err: any) {
      setError("Error al actualizar el perfil")
      console.error("Error updating profile:", err)
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  const updatePreferences = async (
    preferences: Partial<UserPreferences>
  ): Promise<boolean> => {
    if (!uid) return false

    setIsUpdating(true)
    setError(null)

    try {
      const response = await updateUserPreferences(uid, preferences)

      if (response.ok) {
        // Update local profile state
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                preferences: { ...prev.preferences, ...preferences },
              }
            : null
        )
        return true
      } else {
        setError(
          response.errorMessage || "Error al actualizar las preferencias"
        )
        return false
      }
    } catch (err: any) {
      setError("Error al actualizar las preferencias")
      console.error("Error updating preferences:", err)
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  const refreshStats = async (): Promise<void> => {
    if (!uid) return

    try {
      const stats = await calculateUserStats(uid)
      setProfile((prev) => (prev ? { ...prev, stats } : null))
    } catch (err: any) {
      console.error("Error refreshing stats:", err)
    }
  }

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    updatePreferences,
    refreshStats,
    isUpdating,
  }
}
