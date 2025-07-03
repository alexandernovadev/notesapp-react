import { useState } from "react"
import { useJournalStore } from "@/stores/useJournalStore"
import { Note } from "@/types"
import { fileUpload } from "@/helpers/fileUpload"

interface FileUploadOptions {
  maxSize?: number // en bytes
  allowedTypes?: string[]
}

export const useFileUpload = (options: FileUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const { setActiveNote } = useJournalStore()

  const {
    maxSize = 5 * 1024 * 1024, // 5MB por defecto
    allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/jpg",
    ],
  } = options

  const uploadFiles = async (files: FileList) => {
    setIsUploading(true)
    setUploadError(null)

    try {
      // Validar archivos
      const validFiles = Array.from(files).filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Tipo de archivo no válido: ${file.type}`)
        }
        if (file.size > maxSize) {
          throw new Error(`Archivo demasiado grande: ${file.name}`)
        }
        return true
      })

      if (validFiles.length === 0) {
        throw new Error("No hay archivos válidos para subir")
      }

      // Subir usando el helper que ya funciona
      const uploadPromises = validFiles.map(async (file) => {
        try {
          const url = await fileUpload(file)
          return url
        } catch (error: any) {
          throw new Error(`Error al subir ${file.name}: ${error.message}`)
        }
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      // Actualizar la nota activa con las nuevas URLs
      const currentNote = useJournalStore.getState().active
      if (currentNote) {
        const updatedNote: Note = {
          ...currentNote,
          imageUrls: [...(currentNote.imageUrls || []), ...uploadedUrls],
        }
        setActiveNote(updatedNote)
      }

      return uploadedUrls
    } catch (error: any) {
      setUploadError(error.message)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadFiles,
    isUploading,
    uploadError,
    clearError: () => setUploadError(null),
  }
}
