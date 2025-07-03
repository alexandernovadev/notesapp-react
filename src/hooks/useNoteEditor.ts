import { useState, useCallback, useEffect } from "react"
import { useJournal } from "./useJournal"

interface UseNoteEditorProps {
  noteId?: string | undefined
  initialContent?: string
}

export const useNoteEditor = ({
  noteId,
  initialContent = "",
}: UseNoteEditorProps = {}) => {
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState("")
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
    // console.log('🔧 useNoteEditor useEffect - noteId:', noteId, 'active:', active?.id, 'notes count:', notes.length)

    if (noteId && (!active || active.id !== noteId)) {
      // console.log('🔍 Buscando nota con ID:', noteId)
      const found = notes.find((n) => n.id === noteId)
      if (found) {
        console.log("✅ Nota encontrada, estableciendo como activa:", found.id)
        setActiveNote(found)
      } else {
        console.log("❌ Nota NO encontrada con ID:", noteId)
      }
    } else if (!noteId) {
      // CRÍTICO: Limpiar nota activa cuando navegamos a nueva nota
      console.log("🆕 No hay noteId - NUEVA NOTA")
      if (active) {
        console.log("🧹 Limpiando nota activa anterior:", active.id)
        setActiveNote(null)
        setContent("")
        setTitle("")
        setHasUnsavedChanges(false)
      } else {
        // console.log('✨ Ya estaba limpio (active era null)')
      }
    }

    if (active && noteId === active.id) {
      // console.log('📝 Sincronizando contenido con nota activa:', active.id)
      setContent(active.body || "")
      setTitle(active.title || "")
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

  // Save function (solo para editar notas existentes)
  const handleSave = useCallback(async () => {
    if (!hasUnsavedChanges) return

    setIsSaving(true)
    try {
      if (noteId && active && active.id === noteId) {
        // Update existing note - PRESERVAR todos los campos de la nota activa
        // No sobrescribir aquí porque NoteEditorPage ya actualizó setActiveNote con todos los campos
        console.log("🔧 useNoteEditor: Guardando nota existente", noteId)
        await saveNote()
        setHasUnsavedChanges(false)
        setLastSaved(new Date())
      } else {
        console.warn(
          "🔧 useNoteEditor: No se puede guardar - falta noteId o active"
        )
      }
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setIsSaving(false)
    }
  }, [noteId, active, hasUnsavedChanges, saveNote])

  // Manual save
  const save = useCallback(async () => {
    await handleSave()
  }, [handleSave])

  // Create new note (deprecated - usar createNote del journal directamente)
  const createNew = useCallback(async () => {
    console.warn(
      "createNew está deprecated - usar createNote del journal directamente"
    )
  }, [])

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
