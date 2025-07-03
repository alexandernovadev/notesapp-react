import { Note } from '@/types'

export interface SearchFilters {
  categories: string[]
  tags: string[] 
  priorities: ('low' | 'medium' | 'high')[]
  colors: string[]
  showFavoritesOnly: boolean
  showPinnedOnly: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface SearchResult {
  note: Note
  score: number
  highlights: {
    title?: string
    body?: string
    tags?: string[]
  }
}

// Función para limpiar y normalizar texto para búsqueda
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .trim()
}

// Función para highlight de términos encontrados
export const highlightText = (text: string, query: string): string => {
  if (!query.trim()) return text
  
  const normalizedQuery = normalizeText(query)
  const words = normalizedQuery.split(/\s+/).filter(word => word.length > 0)
  
  let highlightedText = text
  
  words.forEach(word => {
    if (word.length < 2) return
    
    const regex = new RegExp(
      `(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 
      'gi'
    )
    highlightedText = highlightedText.replace(
      regex, 
      '<mark style="background-color: #fff59d; font-weight: 600;">$1</mark>'
    )
  })
  
  return highlightedText
}

// Función para calcular score de relevancia
export const calculateRelevanceScore = (note: Note, query: string): number => {
  if (!query.trim()) return 0
  
  const normalizedQuery = normalizeText(query)
  const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 1)
  
  if (queryWords.length === 0) return 0
  
  let score = 0
  const normalizedTitle = normalizeText(note.title || '')
  const normalizedBody = normalizeText(note.body || '')
  const normalizedTags = (note.tags || []).map(tag => normalizeText(tag))
  const normalizedCategory = normalizeText(note.category || '')
  
  queryWords.forEach(word => {
    // Título (peso alto)
    if (normalizedTitle.includes(word)) {
      score += normalizedTitle.startsWith(word) ? 20 : 10
    }
    
    // Coincidencia exacta en título
    if (normalizedTitle === normalizedQuery) {
      score += 50
    }
    
    // Tags (peso alto)
    normalizedTags.forEach(tag => {
      if (tag.includes(word)) {
        score += tag === word ? 15 : 8
      }
    })
    
    // Categoría (peso medio)
    if (normalizedCategory.includes(word)) {
      score += normalizedCategory === word ? 12 : 6
    }
    
    // Contenido del cuerpo (peso bajo pero frecuencia cuenta)
    const bodyMatches = (normalizedBody.match(new RegExp(word, 'g')) || []).length
    score += Math.min(bodyMatches * 2, 10) // Max 10 puntos por contenido
  })
  
  // Bonus por notas favoritas/pineadas
  if (note.isFavorite) score += 2
  if (note.isPinned) score += 3
  
  // Bonus por notas recientes (últimos 7 días)
  const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
  if (note.updatedAt > weekAgo) score += 1
  
  return score
}

// Función principal de búsqueda
export const searchNotes = (
  notes: Note[], 
  query: string, 
  filters: Partial<SearchFilters> = {}
): SearchResult[] => {
  if (!query.trim() && !hasActiveFilters(filters)) {
    return notes.map(note => ({ 
      note, 
      score: 0, 
      highlights: {} 
    }))
  }
  
  let filteredNotes = notes
  
  // Aplicar filtros
  if (filters.categories?.length) {
    filteredNotes = filteredNotes.filter(note => 
      filters.categories!.includes(note.category || 'personal')
    )
  }
  
  if (filters.tags?.length) {
    filteredNotes = filteredNotes.filter(note =>
      note.tags?.some(tag => filters.tags!.includes(tag))
    )
  }
  
  if (filters.priorities?.length) {
    filteredNotes = filteredNotes.filter(note =>
      filters.priorities!.includes(note.priority || 'medium')
    )
  }
  
  if (filters.colors?.length) {
    filteredNotes = filteredNotes.filter(note =>
      filters.colors!.includes(note.color || '#f8fafc')
    )
  }
  
  if (filters.showFavoritesOnly) {
    filteredNotes = filteredNotes.filter(note => note.isFavorite)
  }
  
  if (filters.showPinnedOnly) {
    filteredNotes = filteredNotes.filter(note => note.isPinned)
  }
  
  if (filters.dateRange) {
    const { start, end } = filters.dateRange
    filteredNotes = filteredNotes.filter(note => {
      const noteDate = new Date(note.updatedAt)
      return noteDate >= start && noteDate <= end
    })
  }
  
  // Si no hay query, solo devolver filtros
  if (!query.trim()) {
    return filteredNotes
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map(note => ({ note, score: 0, highlights: {} }))
  }
  
  // Búsqueda con scoring
  const results: SearchResult[] = filteredNotes
    .map(note => {
      const score = calculateRelevanceScore(note, query)
      
      if (score === 0) return null
      
      // Generar highlights
      const highlights: SearchResult['highlights'] = {}
      
      if (normalizeText(note.title || '').includes(normalizeText(query))) {
        highlights.title = highlightText(note.title || '', query)
      }
      
      if (normalizeText(note.body || '').includes(normalizeText(query))) {
        // Extracto del body con highlight
        const bodyWords = note.body?.split(' ') || []
        const startIndex = Math.max(0, 
          bodyWords.findIndex(word => 
            normalizeText(word).includes(normalizeText(query))
          ) - 10
        )
        const excerpt = bodyWords.slice(startIndex, startIndex + 30).join(' ')
        highlights.body = highlightText(excerpt, query)
      }
      
      if (note.tags?.some(tag => normalizeText(tag).includes(normalizeText(query)))) {
        highlights.tags = note.tags
          .filter(tag => normalizeText(tag).includes(normalizeText(query)))
          .map(tag => highlightText(tag, query))
      }
      
      return { note, score, highlights }
    })
    .filter((result): result is SearchResult => result !== null)
    .sort((a, b) => b.score - a.score)
  
  return results
}

// Helper para verificar si hay filtros activos
export const hasActiveFilters = (filters: Partial<SearchFilters>): boolean => {
  return !!(
    filters.categories?.length ||
    filters.tags?.length ||
    filters.priorities?.length ||
    filters.colors?.length ||
    filters.showFavoritesOnly ||
    filters.showPinnedOnly ||
    filters.dateRange
  )
}

// Función para extraer keywords de una nota (para sugerencias)
export const extractKeywords = (notes: Note[]): string[] => {
  const wordCount: Record<string, number> = {}
  
  notes.forEach(note => {
    const text = `${note.title} ${note.body}`.toLowerCase()
    const words = text.match(/\b\w{3,}\b/g) || []
    
    words.forEach(word => {
      if (word.length > 2 && !isCommonWord(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })
  })
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word)
}

// Lista de palabras comunes a ignorar
const isCommonWord = (word: string): boolean => {
  const commonWords = [
    'que', 'para', 'con', 'por', 'una', 'las', 'los', 'del', 'como', 'más',
    'pero', 'sus', 'tan', 'sin', 'ser', 'fue', 'son', 'muy', 'todo', 'esta',
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his'
  ]
  return commonWords.includes(word)
} 