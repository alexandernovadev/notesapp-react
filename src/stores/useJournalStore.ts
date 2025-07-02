import { create } from 'zustand'
import { JournalState, Note } from '@/types'
import { FirebaseDB } from '@/firebase/config'
import { useAuthStore } from './useAuthStore'
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
    
    const newNote: Omit<Note, 'id'> = {
      title: '',
      body: '',
      date: Date.now(),
      imageUrls: [],
    }
    
    try {
      const docRef = await addDoc(collection(FirebaseDB, `users/${uid}/journal/notes`), newNote)
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
    
    const noteToSave = { ...active }
    delete (noteToSave as any).id
    
    try {
      await updateDoc(doc(FirebaseDB, `users/${uid}/journal/notes/${active.id}`), noteToSave)
      set((state) => ({
        notes: state.notes.map((n) => (n.id === active.id ? active : n)),
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
      await deleteDoc(doc(FirebaseDB, `users/${uid}/journal/notes/${active.id}`))
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
      const notesSnap = await getDocs(collection(FirebaseDB, `users/${uid}/journal/notes`))
      const notes: Note[] = []
      notesSnap.forEach((doc) => {
        const data = doc.data()
        notes.push({
          id: doc.id,
          title: data.title || "",
          body: data.body || "",
          date: data.date || Date.now(),
          imageUrls: data.imageUrls || [],
        } as Note)
      })
      set({ notes, isLoading: false })
    } catch (error) {
      console.error('Error loading notes:', error)
      set({ isLoading: false })
    }
  },
})) 