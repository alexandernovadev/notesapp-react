import { useState, useCallback, useEffect } from 'react'
import { useJournal } from './useJournal'
import { Note } from '@/types'

interface UseNoteEditorProps {
  noteId?: string | undefined
  initialContent?: string
  autoSave?: boolean
  autoSaveDelay?: number
}

export const useNoteEditor = ({
  noteId,
  initialContent = '',
  autoSave = true,
  autoSaveDelay = 2000,
}: UseNoteEditorProps = {}) => {
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const {
    active,
    notes,
    isSaving: storeIsSaving,
    messageSaved,
    setActiveNote,
    saveNote,
    createNote,
  } = useJournal()

  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)

  // Initialize content from active note
  useEffect(() => {
    // Si hay noteId y no hay nota activa, buscar la nota por ID y setearla como activa
    if (noteId && (!active || active.id !== noteId)) {
      const found = notes.find(n => n.id === noteId)
      if (found) {
        setActiveNote(found)
      }
    }
    if (active && noteId === active.id) {
      setContent(active.body || '')
      setTitle(active.title || '')
      setHasUnsavedChanges(false)
    }
  }, [active, noteId, notes, setActiveNote])

  // Handle content updates
  const handleContentUpdate = useCallback((newContent: string) => {
    setContent(newContent)
    setHasUnsavedChanges(true)

    // Clear existing timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    // Set new auto-save timer
    if (autoSave) {
      const timer = setTimeout(() => {
        handleSave()
      }, autoSaveDelay)
      setAutoSaveTimer(timer)
    }
  }, [autoSave, autoSaveDelay, autoSaveTimer])

  // Handle title updates
  const handleTitleUpdate = useCallback((newTitle: string) => {
    setTitle(newTitle)
    setHasUnsavedChanges(true)

    // Clear existing timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    // Set new auto-save timer
    if (autoSave) {
      const timer = setTimeout(() => {
        handleSave()
      }, autoSaveDelay)
      setAutoSaveTimer(timer)
    }
  }, [autoSave, autoSaveDelay, autoSaveTimer])

  // Save function
  const handleSave = useCallback(async () => {
    if (!hasUnsavedChanges) return

    setIsSaving(true)
    try {
      if (active) {
        // Update existing note
        const updatedNote = {
          ...active,
          title,
          body: content,
        }
        setActiveNote(updatedNote)
        await saveNote()
      } else {
        // Create new note
        await createNote()
        // The store will handle setting the active note
      }
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setIsSaving(false)
    }
  }, [active, title, content, hasUnsavedChanges, setActiveNote, saveNote, createNote])

  // Manual save
  const save = useCallback(async () => {
    // Clear auto-save timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
      setAutoSaveTimer(null)
    }
    await handleSave()
  }, [autoSaveTimer, handleSave])

  // Create new note
  const createNew = useCallback(async () => {
    setContent('')
    setTitle('')
    setHasUnsavedChanges(false)
    setActiveNote(null)
    await createNote()
  }, [createNote, setActiveNote])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
      }
    }
  }, [autoSaveTimer])

  return {
    // State
    content,
    title,
    isSaving: isSaving || storeIsSaving,
    lastSaved,
    hasUnsavedChanges,
    messageSaved,
    active,

    // Actions
    setContent: handleContentUpdate,
    setTitle: handleTitleUpdate,
    save,
    createNew,
    setActiveNote,
  }
} 