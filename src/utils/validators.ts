import { ValidationRule } from '@/types/forms'

// Built-in validators
export const validators = {
  required: (message = 'Este campo es requerido'): ValidationRule => ({
    required: true,
    message,
    custom: (value) => {
      if (typeof value === 'string') return value.trim().length > 0
      if (Array.isArray(value)) return value.length > 0
      return value !== null && value !== undefined
    }
  }),

  email: (message = 'Ingresa un email válido'): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message,
    custom: (value) => {
      if (typeof value !== 'string') return false
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message: message || `Mínimo ${length} caracteres`,
    custom: (value) => {
      if (typeof value !== 'string') return false
      return value.length >= length
    }
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message: message || `Máximo ${length} caracteres`,
    custom: (value) => {
      if (typeof value !== 'string') return false
      return value.length <= length
    }
  }),

  pattern: (regex: RegExp, message = 'Formato inválido'): ValidationRule => ({
    pattern: regex,
    message,
    custom: (value) => {
      if (typeof value !== 'string') return false
      return regex.test(value)
    }
  }),

  url: (message = 'Ingresa una URL válida'): ValidationRule => ({
    pattern: /^https?:\/\/.+/,
    message,
    custom: (value) => {
      if (typeof value !== 'string') return false
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    }
  }),

  numeric: (message = 'Solo números permitidos'): ValidationRule => ({
    pattern: /^\d+$/,
    message,
    custom: (value) => {
      if (typeof value !== 'string') return false
      return /^\d+$/.test(value)
    }
  }),

  alpha: (message = 'Solo letras permitidas'): ValidationRule => ({
    pattern: /^[a-zA-Z\s]+$/,
    message,
    custom: (value) => {
      if (typeof value !== 'string') return false
      return /^[a-zA-Z\s]+$/.test(value)
    }
  }),

  alphanumeric: (message = 'Solo letras y números permitidos'): ValidationRule => ({
    pattern: /^[a-zA-Z0-9\s]+$/,
    message,
    custom: (value) => {
      if (typeof value !== 'string') return false
      return /^[a-zA-Z0-9\s]+$/.test(value)
    }
  }),

  phone: (message = 'Ingresa un teléfono válido'): ValidationRule => ({
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message,
    custom: (value) => {
      if (typeof value !== 'string') return false
      return /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))
    }
  }),

  password: (message = 'La contraseña debe tener al menos 8 caracteres'): ValidationRule => ({
    minLength: 8,
    message,
    custom: (value) => {
      if (typeof value !== 'string') return false
      return value.length >= 8
    }
  }),

  strongPassword: (message = 'La contraseña debe tener mayúsculas, minúsculas, números y símbolos'): ValidationRule => ({
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message,
    custom: (value) => {
      if (typeof value !== 'string') return false
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)
    }
  }),

  confirmPassword: (passwordField: string, message = 'Las contraseñas no coinciden'): ValidationRule => ({
    message,
    custom: (value: any, allValues?: any) => {
      if (typeof value !== 'string') return false
      return value === allValues?.[passwordField]
    }
  }),

  // Custom validators
  custom: (validator: (value: any, allValues?: any) => boolean, message: string): ValidationRule => ({
    message,
    custom: validator
  }),

  // File validators
  fileSize: (maxSize: number, message?: string): ValidationRule => ({
    message: message || `El archivo no debe superar ${maxSize} bytes`,
    custom: (value) => {
      if (!value || !(value instanceof File)) return true
      return value.size <= maxSize
    }
  }),

  fileType: (allowedTypes: string[], message?: string): ValidationRule => ({
    message: message || `Tipos permitidos: ${allowedTypes.join(', ')}`,
    custom: (value) => {
      if (!value || !(value instanceof File)) return true
      return allowedTypes.includes(value.type)
    }
  }),

  // Date validators
  minDate: (minDate: Date, message?: string): ValidationRule => ({
    message: message || `La fecha debe ser posterior a ${minDate.toLocaleDateString()}`,
    custom: (value) => {
      if (!value) return true
      const date = new Date(value)
      return date >= minDate
    }
  }),

  maxDate: (maxDate: Date, message?: string): ValidationRule => ({
    message: message || `La fecha debe ser anterior a ${maxDate.toLocaleDateString()}`,
    custom: (value) => {
      if (!value) return true
      const date = new Date(value)
      return date <= maxDate
    }
  }),

  // Array validators
  minItems: (min: number, message?: string): ValidationRule => ({
    message: message || `Mínimo ${min} elementos`,
    custom: (value) => {
      if (!Array.isArray(value)) return false
      return value.length >= min
    }
  }),

  maxItems: (max: number, message?: string): ValidationRule => ({
    message: message || `Máximo ${max} elementos`,
    custom: (value) => {
      if (!Array.isArray(value)) return false
      return value.length <= max
    }
  })
}

// Validation helper functions
export const validateField = <T>(
  value: T,
  rules: ValidationRule<T>[],
  allValues?: any
): { isValid: boolean; error: string | null } => {
  for (const rule of rules) {
    // Required validation
    if (rule.required && !rule.custom) {
      if (typeof value === 'string' && value.trim().length === 0) {
        return { isValid: false, error: rule.message || 'Este campo es requerido' }
      }
      if (value === null || value === undefined) {
        return { isValid: false, error: rule.message || 'Este campo es requerido' }
      }
    }

    // Custom validation
    if (rule.custom) {
      const isValid = rule.custom(value, allValues)
      if (!isValid) {
        return { isValid: false, error: rule.message || 'Valor inválido' }
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        return { isValid: false, error: rule.message || 'Formato inválido' }
      }
    }

    // Length validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return { isValid: false, error: rule.message || `Mínimo ${rule.minLength} caracteres` }
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return { isValid: false, error: rule.message || `Máximo ${rule.maxLength} caracteres` }
      }
    }
  }

  return { isValid: true, error: null }
}

// Export default validators
export default validators 