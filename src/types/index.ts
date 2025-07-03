// Application types

export interface User {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
}

// Extended User Profile for premium features
export interface UserProfile extends User {
  bio?: string
  location?: string
  website?: string
  phoneNumber?: string
  birthDate?: string
  occupation?: string
  company?: string
  createdAt?: number
  lastLoginAt?: number
  isEmailVerified?: boolean
  preferences?: UserPreferences
  stats?: UserStats
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto'
  language?: string
  timezone?: string
  emailNotifications?: boolean
  pushNotifications?: boolean
  autoSave?: boolean
  defaultNoteColor?: string
  defaultCategory?: string
  editorFontSize?: 'small' | 'medium' | 'large'
  editorFontFamily?: string
  compactMode?: boolean
  showWordCount?: boolean
  showReadingTime?: boolean
}

export interface UserStats {
  totalNotes?: number
  totalWords?: number
  totalReadingTime?: number
  favoriteNotes?: number
  categoriesUsed?: string[]
  tagsUsed?: string[]
  averageNoteLength?: number
  mostUsedCategory?: string
  createdThisWeek?: number
  createdThisMonth?: number
  longestStreak?: number
  currentStreak?: number
  lastActiveDate?: number
}

export interface ProfileUpdateData {
  displayName?: string
  photoURL?: string
  bio?: string
  location?: string
  website?: string
  phoneNumber?: string
  birthDate?: string
  occupation?: string
  company?: string
  preferences?: Partial<UserPreferences>
}

export interface Note {
  id: string
  title: string
  body: string
  createdAt: number
  updatedAt: number
  imageUrls: string[]
  category?: string
  tags?: string[]
  isFavorite?: boolean
  isPinned?: boolean
  color?: string
  priority?: 'low' | 'medium' | 'high'
  wordCount?: number
  readTime?: number
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