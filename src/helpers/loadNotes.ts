import { collection, getDocs } from "firebase/firestore/lite"
import { FirebaseDB } from "../firebase/config"
import { Note } from "@/types"

export const loadNotes = async (uid: string = ""): Promise<Note[]> => {
  if (!uid) {
    throw new Error("El UID del usuario no existe")
  }

  try {
    const collectionRef = collection(FirebaseDB, `${uid}/journal/notes`)
    const docs = await getDocs(collectionRef)

    const notes: Note[] = []
    docs.forEach((doc) => {
      const data = doc.data()
      notes.push({
        id: doc.id,
        title: data.title || "",
        body: data.body || "",
        date: data.date || Date.now(),
        imageUrls: data.imageUrls || [],
      })
    })

    return notes
  } catch (error) {
    console.error("Error loading notes:", error)
    throw new Error("Error al cargar las notas")
  }
}
