import { useState } from 'react'

export const usePasswordVisibility = (fields: string[] = ['password']) => {
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>(
    fields.reduce((acc, field) => ({ ...acc, [field]: false }), {})
  )

  const toggleVisibility = (field: string) => {
    setVisibleFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const isVisible = (field: string) => visibleFields[field] || false

  return {
    visibleFields,
    toggleVisibility,
    isVisible,
  }
} 