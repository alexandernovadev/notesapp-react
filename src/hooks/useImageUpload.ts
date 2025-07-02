import { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { FirebaseStorage } from '@/firebase/config'
import { useAuthStore } from '@/stores/useAuthStore'

interface UploadProgress {
  [key: string]: number
}

interface UploadError {
  [key: string]: string
}

export const useImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({})
  const [uploadErrors, setUploadErrors] = useState<UploadError>({})
  const [isUploading, setIsUploading] = useState(false)
  const { uid } = useAuthStore()

  const uploadImages = async (files: File[], noteId: string): Promise<string[]> => {
    if (!uid) {
      throw new Error('Usuario no autenticado')
    }

    setIsUploading(true)
    setUploadProgress({})
    setUploadErrors({})

    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${uid}/${noteId}/${Date.now()}_${index}_${file.name}`
      const storageRef = ref(FirebaseStorage, fileName)
      
      return new Promise<string>((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setUploadProgress(prev => ({
              ...prev,
              [fileName]: progress
            }))
          },
          (error) => {
            setUploadErrors(prev => ({
              ...prev,
              [fileName]: error.message
            }))
            reject(error)
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              resolve(downloadURL)
            } catch (error) {
              reject(error)
            }
          }
        )
      })
    })

    try {
      const urls = await Promise.all(uploadPromises)
      setIsUploading(false)
      return urls
    } catch (error) {
      setIsUploading(false)
      throw error
    }
  }

  const deleteImage = async (imageUrl: string): Promise<void> => {
    try {
      const imageRef = ref(FirebaseStorage, imageUrl)
      // Note: Firebase Storage doesn't have a direct delete method in the web SDK
      // You might need to implement this differently or use a Cloud Function
      console.log('Image deletion not implemented yet')
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  }

  return {
    uploadImages,
    deleteImage,
    uploadProgress,
    uploadErrors,
    isUploading
  }
} 