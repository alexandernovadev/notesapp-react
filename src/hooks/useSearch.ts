import { useState, useEffect, useMemo, useCallback } from "react"
import { useJournal } from "./useJournal"
import {
  searchNotes,
  SearchFilters,
  hasActiveFilters,
  extractKeywords,
} from "@/utils/searchUtils"

interface UseSearchProps {
  initialQuery?: string
  debounceMs?: number
}

export const useSearch = ({
  initialQuery = "",
  debounceMs = 300,
}: UseSearchProps = {}) => {
  const { notes, isLoading } = useJournal()

  // Estado de búsqueda
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<Partial<SearchFilters>>({})
  const [isSearching, setIsSearching] = useState(false)

  // Historial y sugerencias
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Debounce para la query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      setIsSearching(false)
    }, debounceMs)

    if (query !== debouncedQuery) {
      setIsSearching(true)
    }

    return () => clearTimeout(timer)
  }, [query, debounceMs, debouncedQuery])

  // Resultados de búsqueda memoizados
  const searchResults = useMemo(() => {
    if (isLoading) return []

    const results = searchNotes(notes, debouncedQuery, filters)

    // Agregar query al historial si hay resultados y no está vacía
    if (debouncedQuery.trim() && results.length > 0) {
      setSearchHistory((prev) => {
        const filtered = prev.filter((q) => q !== debouncedQuery.trim())
        return [debouncedQuery.trim(), ...filtered].slice(0, 10)
      })
    }

    return results
  }, [notes, debouncedQuery, filters, isLoading])

  // Keywords para sugerencias
  const keywords = useMemo(() => {
    return extractKeywords(notes)
  }, [notes])

  // Filtros disponibles basados en las notas existentes
  const availableFilters = useMemo(() => {
    const categories = Array.from(
      new Set(notes.map((note) => note.category || "personal"))
    ).sort()

    const tags = Array.from(
      new Set(notes.flatMap((note) => note.tags || []))
    ).sort()

    const colors = Array.from(
      new Set(notes.map((note) => note.color || "#f8fafc"))
    )

    return {
      categories,
      tags,
      colors,
      priorities: ["high", "medium", "low"] as const,
    }
  }, [notes])

  // Estadísticas de búsqueda
  const searchStats = useMemo(() => {
    const totalNotes = notes.length
    const resultsCount = searchResults.length
    const hasQuery = debouncedQuery.trim().length > 0
    const hasFilters = hasActiveFilters(filters)

    return {
      totalNotes,
      resultsCount,
      hasQuery,
      hasFilters,
      showingFiltered: hasQuery || hasFilters,
    }
  }, [notes.length, searchResults.length, debouncedQuery, filters])

  // Sugerencias de búsqueda
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) {
      return searchHistory.slice(0, 5)
    }

    const matchingKeywords = keywords
      .filter((keyword) => keyword.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)

    const matchingHistory = searchHistory
      .filter(
        (historyQuery) =>
          historyQuery.toLowerCase().includes(query.toLowerCase()) &&
          historyQuery !== query
      )
      .slice(0, 3)

    return [...matchingKeywords, ...matchingHistory]
  }, [query, keywords, searchHistory])

  // Funciones para manejar filtros
  const updateFilter = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const toggleFilterValue = useCallback(
    <K extends keyof SearchFilters>(key: K, value: any) => {
      setFilters((prev) => {
        const currentArray = (prev[key] as any[]) || []
        const exists = currentArray.includes(value)

        return {
          ...prev,
          [key]: exists
            ? currentArray.filter((item) => item !== value)
            : [...currentArray, value],
        }
      })
    },
    []
  )

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  const clearSearch = useCallback(() => {
    setQuery("")
    setDebouncedQuery("")
    setFilters({})
  }, [])

  // Función para ejecutar búsqueda (útil para llamadas manuales)
  const executeSearch = useCallback(
    (searchQuery: string, searchFilters?: Partial<SearchFilters>) => {
      setQuery(searchQuery)
      if (searchFilters) {
        setFilters(searchFilters)
      }
    },
    []
  )

  // Función para seleccionar sugerencia
  const selectSuggestion = useCallback((suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
  }, [])

  // Handlers para UI
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery)
    setShowSuggestions(true)
  }, [])

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      selectSuggestion(suggestion)
    },
    [selectSuggestion]
  )

  const handleClearSearch = useCallback(() => {
    clearSearch()
    setShowSuggestions(false)
  }, [clearSearch])

  return {
    // Estado
    query,
    debouncedQuery,
    filters,
    isSearching: isSearching || isLoading,
    showSuggestions,

    // Resultados
    searchResults,
    searchStats,
    suggestions,
    keywords,
    availableFilters,
    searchHistory,

    // Acciones
    setQuery: handleQueryChange,
    updateFilter,
    toggleFilterValue,
    clearFilters,
    clearSearch: handleClearSearch,
    executeSearch,
    selectSuggestion: handleSuggestionClick,
    setShowSuggestions,

    // Helpers
    hasActiveFilters: hasActiveFilters(filters),
    hasResults: searchResults.length > 0,
    isEmpty: !query.trim() && !hasActiveFilters(filters),
  }
}
