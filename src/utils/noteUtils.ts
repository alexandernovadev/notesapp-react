import { Note } from '@/types'

// Utilidades para notas

export const calculateWordCount = (text: string): number => {
  if (!text || text.trim() === '') return 0
  // Eliminar HTML tags y contar palabras
  const cleanText = text.replace(/<[^>]*>/g, '').trim()
  return cleanText.split(/\s+/).filter(word => word.length > 0).length
}

export const calculateReadTime = (wordCount: number): number => {
  // Velocidad promedio de lectura: 200 palabras por minuto
  const wordsPerMinute = 200
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return Math.max(1, minutes) // Mínimo 1 minuto
}

export const getNoteStats = (body: string) => {
  const wordCount = calculateWordCount(body)
  const readTime = calculateReadTime(wordCount)
  
  return {
    wordCount,
    readTime
  }
}

// Categorías predefinidas
export const NOTE_CATEGORIES = [
  'personal',
  'trabajo',
  'ideas',
  'proyectos',
  'estudios',
  'recetas',
  'viajes',
  'finanzas',
  'salud',
  'otros'
] as const

export type NoteCategory = typeof NOTE_CATEGORIES[number]

// Colores predefinidos para notas
export const NOTE_COLORS = [
  '#f8fafc', // default (gris claro)
  '#fef2f2', // red
  '#fef3c7', // yellow
  '#d1fae5', // green
  '#dbeafe', // blue
  '#e0e7ff', // indigo
  '#f3e8ff', // purple
  '#fce7f3', // pink
] as const

export type NoteColor = typeof NOTE_COLORS[number]

// Prioridades
export const NOTE_PRIORITIES = ['low', 'medium', 'high'] as const
export type NotePriority = typeof NOTE_PRIORITIES[number]

// Función para crear una nueva nota con valores por defecto
export const createNewNote = (): Omit<Note, 'id'> => {
  const now = Date.now()
  return {
    title: '',
    body: '',
    createdAt: now,
    updatedAt: now,
    imageUrls: [],
    category: 'personal',
    tags: [],
    isFavorite: false,
    isPinned: false,
    color: '#f8fafc',
    priority: 'medium',
    wordCount: 0,
    readTime: 1
  }
} 