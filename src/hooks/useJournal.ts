import { useEffect } from "react"
import { useJournalStore } from "@/stores/useJournalStore"
import { useAuth } from "./useAuth"

export const useJournal = () => {
  const {
    notes,
    active,
    isSaving,
    isLoading,
    messageSaved,
    setActiveNote,
    startNewNote,
    startSaveNote,
    startDeletingNote,
    loadNotes,
    toggleFavorite,
    togglePinned,
    updateNoteCategory,
    updateNoteColor,
    updateNotePriority,
    duplicateNote,
  } = useJournalStore()

  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      loadNotes()
    }
  }, [isAuthenticated, loadNotes])

  return {
    // State
    notes,
    active,
    isSaving,
    isLoading,
    messageSaved,

    // Actions
    setActiveNote,
    createNote: startNewNote,
    saveNote: startSaveNote,
    deleteNote: startDeletingNote,
    loadNotes,
    toggleFavorite,
    togglePinned,
    updateNoteCategory,
    updateNoteColor,
    updateNotePriority,
  }
}
