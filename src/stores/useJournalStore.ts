import { create } from 'zustand'
import { JournalState, Note } from '@/types'
import { FirebaseDB } from '@/firebase/config'
import { useAuthStore } from './useAuthStore'
import { getNoteStats, createNewNote } from '@/utils/noteUtils'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore/lite'

interface JournalStore extends JournalState {
  setActiveNote: (note: Note | null) => void
  setNotes: (notes: Note[]) => void
  startNewNote: () => Promise<void>
  startSaveNote: () => Promise<void>
  startDeletingNote: () => Promise<void>
  loadNotes: () => Promise<void>
  setSaving: (saving: boolean) => void
  setLoading: (loading: boolean) => void
  toggleFavorite: (noteId: string) => Promise<void>
  togglePinned: (noteId: string) => Promise<void>
  updateNoteCategory: (noteId: string, category: string) => Promise<void>
  updateNoteColor: (noteId: string, color: string) => Promise<void>
  updateNotePriority: (noteId: string, priority: 'low' | 'medium' | 'high') => Promise<void>
  duplicateNote: (noteId: string) => Promise<void>
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  isSaving: false,
  isLoading: false,
  messageSaved: '',
  notes: [],
  active: null,

  setActiveNote: (note) => set({ active: note, messageSaved: '' }),
  setNotes: (notes) => set({ notes }),
  setSaving: (saving) => set({ isSaving: saving }),
  setLoading: (loading) => set({ isLoading: loading }),

  startNewNote: async () => {
    set({ isSaving: true })
    const { uid } = useAuthStore.getState()
    if (!uid) {
      set({ isSaving: false })
      return
    }
    
    const newNote = createNewNote()
    
    try {
      const docRef = await addDoc(collection(FirebaseDB, `users/${uid}/notes`), newNote)
      const note: Note = { ...newNote, id: docRef.id }
      set((state) => ({
        notes: [...state.notes, note],
        active: note,
        isSaving: false,
      }))
    } catch (error) {
      console.error('Error creating note:', error)
      set({ isSaving: false })
    }
  },

  startSaveNote: async () => {
    set({ isSaving: true })
    const { uid } = useAuthStore.getState()
    const { active } = get()
    if (!uid || !active) {
      set({ isSaving: false })
      return
    }
    
    // Calcular estadísticas actualizadas
    const stats = getNoteStats(active.body)
    const noteToSave = { 
      ...active, 
      updatedAt: Date.now(),
      wordCount: stats.wordCount,
      readTime: stats.readTime
    }
    delete (noteToSave as any).id
    
    try {
      await updateDoc(doc(FirebaseDB, `users/${uid}/notes/${active.id}`), noteToSave)
      const updatedNote = { ...active, ...noteToSave }
      set((state) => ({
        notes: state.notes.map((n) => (n.id === active.id ? updatedNote : n)),
        active: updatedNote,
        isSaving: false,
        messageSaved: `${active.title}, actualizada correctamente`,
      }))
    } catch (error) {
      console.error('Error saving note:', error)
      set({ isSaving: false })
    }
  },

  startDeletingNote: async () => {
    const { uid } = useAuthStore.getState()
    const { active } = get()
    if (!uid || !active) return
    
    try {
      await deleteDoc(doc(FirebaseDB, `users/${uid}/notes/${active.id}`))
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== active.id),
        active: null,
      }))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  },

  loadNotes: async () => {
    set({ isLoading: true })
    const { uid } = useAuthStore.getState()
    if (!uid) {
      set({ isLoading: false })
      return
    }
    
    try {
      const notesSnap = await getDocs(collection(FirebaseDB, `users/${uid}/notes`))
      const notes: Note[] = []
      notesSnap.forEach((doc) => {
        const data = doc.data()
        const now = Date.now()
        
        // Migración de notas antiguas a nueva estructura
        const note: Note = {
          id: doc.id,
          title: data.title || "",
          body: data.body || "",
          createdAt: data.createdAt || data.date || now,
          updatedAt: data.updatedAt || data.date || now,
          imageUrls: data.imageUrls || [],
          category: data.category || "personal",
          tags: data.tags || [],
          isFavorite: data.isFavorite || false,
          isPinned: data.isPinned || false,
          color: data.color || "#f8fafc",
          priority: data.priority || "medium",
          wordCount: data.wordCount || getNoteStats(data.body || "").wordCount,
          readTime: data.readTime || getNoteStats(data.body || "").readTime,
        }
        notes.push(note)
      })
      set({ notes, isLoading: false })
    } catch (error) {
      console.error('Error loading notes:', error)
      set({ isLoading: false })
    }
  },

  toggleFavorite: async (noteId: string) => {
    const { uid } = useAuthStore.getState()
    const { notes } = get()
    if (!uid) return
    
    const note = notes.find(n => n.id === noteId)
    if (!note) return
    
    const newFavoriteState = !note.isFavorite
    
    try {
      await updateDoc(doc(FirebaseDB, `users/${uid}/notes/${noteId}`), {
        isFavorite: newFavoriteState,
        updatedAt: Date.now()
      })
      
      set((state) => ({
        notes: state.notes.map((n) => 
          n.id === noteId ? { ...n, isFavorite: newFavoriteState, updatedAt: Date.now() } : n
        ),
        active: state.active?.id === noteId 
          ? { ...state.active, isFavorite: newFavoriteState, updatedAt: Date.now() }
          : state.active
      }))
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  },

  togglePinned: async (noteId: string) => {
    const { uid } = useAuthStore.getState()
    const { notes } = get()
    if (!uid) return
    
    const note = notes.find(n => n.id === noteId)
    if (!note) return
    
    const newPinnedState = !note.isPinned
    
    try {
      await updateDoc(doc(FirebaseDB, `users/${uid}/notes/${noteId}`), {
        isPinned: newPinnedState,
        updatedAt: Date.now()
      })
      
      set((state) => ({
        notes: state.notes.map((n) => 
          n.id === noteId ? { ...n, isPinned: newPinnedState, updatedAt: Date.now() } : n
        ),
        active: state.active?.id === noteId 
          ? { ...state.active, isPinned: newPinnedState, updatedAt: Date.now() }
          : state.active
      }))
    } catch (error) {
      console.error('Error toggling pinned:', error)
    }
  },

  updateNoteCategory: async (noteId: string, category: string) => {
    const { uid } = useAuthStore.getState()
    if (!uid) return
    
    try {
      await updateDoc(doc(FirebaseDB, `users/${uid}/notes/${noteId}`), {
        category,
        updatedAt: Date.now()
      })
      
      set((state) => ({
        notes: state.notes.map((n) => 
          n.id === noteId ? { ...n, category, updatedAt: Date.now() } : n
        ),
        active: state.active?.id === noteId 
          ? { ...state.active, category, updatedAt: Date.now() }
          : state.active
      }))
    } catch (error) {
      console.error('Error updating category:', error)
    }
  },

  updateNoteColor: async (noteId: string, color: string) => {
    const { uid } = useAuthStore.getState()
    if (!uid) return
    
    try {
      await updateDoc(doc(FirebaseDB, `users/${uid}/notes/${noteId}`), {
        color,
        updatedAt: Date.now()
      })
      
      set((state) => ({
        notes: state.notes.map((n) => 
          n.id === noteId ? { ...n, color, updatedAt: Date.now() } : n
        ),
        active: state.active?.id === noteId 
          ? { ...state.active, color, updatedAt: Date.now() }
          : state.active
      }))
    } catch (error) {
      console.error('Error updating color:', error)
    }
  },

  updateNotePriority: async (noteId: string, priority: 'low' | 'medium' | 'high') => {
    const { uid } = useAuthStore.getState()
    if (!uid) return
    
    try {
      await updateDoc(doc(FirebaseDB, `users/${uid}/notes/${noteId}`), {
        priority,
        updatedAt: Date.now()
      })
      
      set((state) => ({
        notes: state.notes.map((n) => 
          n.id === noteId ? { ...n, priority, updatedAt: Date.now() } : n
        ),
        active: state.active?.id === noteId 
          ? { ...state.active, priority, updatedAt: Date.now() }
          : state.active
      }))
    } catch (error) {
      console.error('Error updating priority:', error)
    }
  },

  duplicateNote: async (noteId: string) => {
    const { uid } = useAuthStore.getState()
    const { notes } = get()
    if (!uid) return
    
    const originalNote = notes.find(n => n.id === noteId)
    if (!originalNote) return
    
    try {
      // Create duplicate note data
      const duplicateData = {
        title: `${originalNote.title} (Copia)`,
        body: originalNote.body,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        imageUrls: [...originalNote.imageUrls],
        category: originalNote.category || 'personal',
        tags: [...(originalNote.tags || [])],
        isFavorite: false,
        isPinned: false,
        color: originalNote.color || '#f8fafc',
        priority: originalNote.priority || 'medium',
        wordCount: originalNote.wordCount || 0,
        readTime: originalNote.readTime || 1,
      }
      
      // Add to Firestore
      const docRef = await addDoc(collection(FirebaseDB, `users/${uid}/notes`), duplicateData)
      const newNote: Note = { ...duplicateData, id: docRef.id }
      
      // Update local state
      set((state) => ({
        notes: [...state.notes, newNote],
        active: newNote,
      }))
    } catch (error) {
      console.error('Error duplicating note:', error)
    }
  },
})) 