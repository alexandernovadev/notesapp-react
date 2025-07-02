import { useState } from 'react'

interface UseAuthFormProps<T> {
  initialValues: T
  onSubmit: (values: T) => Promise<void>
}

export const useAuthForm = <T extends Record<string, any>>({ 
  initialValues, 
  onSubmit 
}: UseAuthFormProps<T>) => {
  const [formData, setFormData] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setError = (field: keyof T, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }))
  }

  const clearErrors = () => {
    setErrors({})
  }

  return {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
    setError,
    clearErrors,
  }
} 