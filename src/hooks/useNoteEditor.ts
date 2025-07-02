import { useState, useCallback, useEffect } from 'react'
import { useJournal } from './useJournal'
import { Note } from '@/types'

interface UseNoteEditorProps {
  noteId?: string | undefined
  initialContent?: string
}

export const useNoteEditor = ({
  noteId,
  initialContent = '',
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

  // Initialize content from active note
  useEffect(() => {
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
  }, [])

  // Handle title updates
  const handleTitleUpdate = useCallback((newTitle: string) => {
    setTitle(newTitle)
    setHasUnsavedChanges(true)
  }, [])

  // Save function
  const handleSave = useCallback(async () => {
    if (!hasUnsavedChanges) return

    setIsSaving(true)
    try {
      if (active) {
        // Update existing note - PRESERVAR todos los campos de la nota activa
        // No sobrescribir aquí porque NoteEditorPage ya actualizó setActiveNote con todos los campos
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
  }, [active, hasUnsavedChanges, saveNote, createNote])

  // Manual save
  const save = useCallback(async () => {
    await handleSave()
  }, [handleSave])

  // Create new note
  const createNew = useCallback(async () => {
    setContent('')
    setTitle('')
    setHasUnsavedChanges(false)
    setActiveNote(null)
    await createNote()
  }, [createNote, setActiveNote])

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
    setHasUnsavedChanges,
  }
} 