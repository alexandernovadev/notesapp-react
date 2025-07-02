// Application types

export interface User {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
}

export interface Note {
  id: string
  title: string
  body: string
  date: number
  imageUrls: string[]
}

export interface AuthState {
  status: 'checking' | 'not-authenticated' | 'authenticated'
  uid: string | null
  email: string | null
  displayName: string | null
  photoURL: string | null
  errorMessage: string | null
}

export interface JournalState {
  isSaving: boolean
  isLoading: boolean
  messageSaved: string
  notes: Note[]
  active: Note | null
}

export interface RootState {
  auth: AuthState
  journal: JournalState
}

export interface FormData {
  email: string
  password: string
  displayName?: string
}

export interface FormValidations {
  [key: string]: [(value: string) => boolean, string]
}

export interface FormState {
  [key: string]: string
}

export interface FormValidationState {
  [key: string]: string | null
}

// Component Props
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  sx?: any
}

export interface TextFieldProps {
  label: string
  type?: string
  placeholder?: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  helperText?: string
  disabled?: boolean
  fullWidth?: boolean
  multiline?: boolean
  rows?: number
}

export interface AlertProps {
  type: 'error' | 'warning' | 'info' | 'success'
  errorMessage?: string
}

// Firebase types
export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

// Cloudinary types
export interface CloudinaryResponse {
  secure_url: string
  public_id: string
  format: string
  width: number
  height: number
} 