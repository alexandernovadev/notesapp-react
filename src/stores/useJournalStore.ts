import { create } from 'zustand'
import { JournalState, Note } from '@/types'
import { FirebaseDB } from '@/firebase/config'
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
    const { uid } = (window as any).useAuthStore?.getState?.() || {}
    if (!uid) return
    const newNote: Omit<Note, 'id'> = {
      title: '',
      body: '',
      date: Date.now(),
      imageUrls: [],
    }
    const docRef = await addDoc(collection(FirebaseDB, `users/${uid}/journal/notes`), newNote)
    const note: Note = { ...newNote, id: docRef.id }
    set((state) => ({
      notes: [...state.notes, note],
      active: note,
      isSaving: false,
    }))
  },

  startSaveNote: async () => {
    set({ isSaving: true })
    const { uid } = (window as any).useAuthStore?.getState?.() || {}
    const { active } = get()
    if (!uid || !active) return
    const noteToSave = { ...active }
    delete (noteToSave as any).id
    await updateDoc(doc(FirebaseDB, `users/${uid}/journal/notes/${active.id}`), noteToSave)
    set((state) => ({
      notes: state.notes.map((n) => (n.id === active.id ? active : n)),
      isSaving: false,
      messageSaved: `${active.title}, actualizada correctamente`,
    }))
  },

  startDeletingNote: async () => {
    const { uid } = (window as any).useAuthStore?.getState?.() || {}
    const { active } = get()
    if (!uid || !active) return
    await deleteDoc(doc(FirebaseDB, `users/${uid}/journal/notes/${active.id}`))
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== active.id),
      active: null,
    }))
  },

  loadNotes: async () => {
    set({ isLoading: true })
    const { uid } = (window as any).useAuthStore?.getState?.() || {}
    if (!uid) return
    const notesSnap = await getDocs(collection(FirebaseDB, `users/${uid}/journal/notes`))
    const notes: Note[] = []
    notesSnap.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() } as Note)
    })
    set({ notes, isLoading: false })
  },
})) 