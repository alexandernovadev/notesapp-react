// Advanced Form Types for useForm hook

export type ValidationRule<T = any> = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: T, allValues?: any) => boolean
  message?: string
}

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>
}

export type ValidationError = {
  type: string
  message: string
}

export type ValidationErrors<T> = {
  [K in keyof T]?: ValidationError
}

export type FieldState<T> = {
  value: T
  error: ValidationError | null
  touched: boolean
  dirty: boolean
  isValid: boolean
}

export type FormState<T> = {
  [K in keyof T]: FieldState<T[K]>
}

export type FormConfig<T> = {
  initialValues: T
  validationRules?: ValidationRules<T>
  onSubmit?: (values: T) => void | Promise<void>
  onError?: (errors: ValidationErrors<T>) => void
  validateOnChange?: boolean
  validateOnBlur?: boolean
  validateOnSubmit?: boolean
}

export type FormMethods<T> = {
  // Values
  values: T
  getValue: <K extends keyof T>(field: K) => T[K]
  setValue: <K extends keyof T>(field: K, value: T[K]) => void
  
  // Errors
  errors: ValidationErrors<T>
  getError: <K extends keyof T>(field: K) => ValidationError | null
  setError: <K extends keyof T>(field: K, error: ValidationError) => void
  clearError: <K extends keyof T>(field: K) => void
  clearAllErrors: () => void
  
  // Field States
  touched: { [K in keyof T]: boolean }
  dirty: { [K in keyof T]: boolean }
  isValid: { [K in keyof T]: boolean }
  
  // Form States
  isFormValid: boolean
  isFormDirty: boolean
  isFormTouched: boolean
  isSubmitting: boolean
  
  // Event Handlers
  handleChange: <K extends keyof T>(field: K) => (value: T[K]) => void
  handleBlur: <K extends keyof T>(field: K) => () => void
  handleSubmit: (e?: React.FormEvent) => void
  
  // Actions
  reset: (values?: Partial<T>) => void
  setValues: (values: Partial<T>) => void
  validate: () => ValidationErrors<T>
  validateField: <K extends keyof T>(field: K) => ValidationError | null
  
  // Utilities
  register: <K extends keyof T>(field: K) => {
    value: T[K]
    onChange: (value: T[K]) => void
    onBlur: () => void
    error: ValidationError | null
    touched: boolean
    dirty: boolean
    isValid: boolean
  }
}

// Built-in validation types
export type BuiltInValidators = {
  required: (message?: string) => ValidationRule
  email: (message?: string) => ValidationRule
  minLength: (length: number, message?: string) => ValidationRule
  maxLength: (length: number, message?: string) => ValidationRule
  pattern: (regex: RegExp, message?: string) => ValidationRule
  url: (message?: string) => ValidationRule
  numeric: (message?: string) => ValidationRule
  alpha: (message?: string) => ValidationRule
  alphanumeric: (message?: string) => ValidationRule
  phone: (message?: string) => ValidationRule
  password: (message?: string) => ValidationRule
  confirmPassword: (passwordField: string, message?: string) => ValidationRule
}

// Common form field types
export type TextFieldValue = string
export type NumberFieldValue = number
export type BooleanFieldValue = boolean
export type SelectFieldValue = string | number
export type MultiSelectFieldValue = (string | number)[]
export type DateFieldValue = Date | string
export type FileFieldValue = File | File[]

// Form field types
export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'switch'
  | 'slider' 