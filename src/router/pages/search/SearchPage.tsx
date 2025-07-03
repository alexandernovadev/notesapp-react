import React from "react"
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Grid,
  Chip,
  Collapse,
  Button,
  LinearProgress,
  FormControlLabel,
  Switch,
  Badge,
  Card,
  CardContent,
  Popper,
  ClickAwayListener,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material"
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Palette as PaletteIcon,
  AccessTime as PriorityIcon,
  Star as StarIcon,
  PushPin as PinIcon,
} from "@mui/icons-material"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useSearch } from "@/hooks/useSearch"
import { useJournal } from "@/hooks/useJournal"
import { SearchResult } from "@/utils/searchUtils"
import "@/theme/swal2-zindex-fix.css"
import { COLOR_PALETTE } from "@/utils/noteOptions"

export const SearchPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const { setActiveNote } =
    useJournal()

  const {
    query,
    setQuery,
    filters,
    updateFilter,
    toggleFilterValue,
    clearFilters,
    clearSearch,
    searchResults,
    searchStats,
    suggestions,
    availableFilters,
    isSearching,
    showSuggestions,
    setShowSuggestions,
    hasActiveFilters,
    hasResults,
    isEmpty,
  } = useSearch({ initialQuery })

  // Estados locales
  const [showFilters, setShowFilters] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  // Actualizar URL cuando cambia la query
  React.useEffect(() => {
    if (query.trim()) {
      setSearchParams({ q: query })
    } else {
      setSearchParams({})
    }
  }, [query, setSearchParams])

  // Handlers para las notas
  const handleNoteClick = (noteId: string) => {
    const result = searchResults.find((r) => r.note.id === noteId)
    if (result) {
      setActiveNote(result.note)
      navigate(`/notes/${noteId}`)
    }
  }

  // Handler para sugerencias
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
  }

  const handleSearchFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget)
    setShowSuggestions(true)
  }

  const handleClickAway = () => {
    setShowSuggestions(false)
    setAnchorEl(null)
  }

  // Renderizar resultados con highlighting
  const renderHighlightedResult = (result: SearchResult) => {
    const { note, highlights } = result



    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
        <Card
          sx={{
            position: "relative",
            "& mark": {
              backgroundColor: "#fff59d",
              fontWeight: 600,
              borderRadius: 0.5,
              px: 0.25,
            },
          }}
        >
          <CardContent sx={{ p: 1.5 }}>
            {/* Score badge para debugging */}
            {process.env.NODE_ENV === "development" && result.score > 0 && (
              <Chip
                label={`Score: ${result.score}`}
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "info.main",
                  color: "white",
                  fontSize: "0.6rem",
                  height: 16,
                }}
              />
            )}

            {/* Usar NoteCard con contenido highlighted */}
            <Box
              onClick={() => handleNoteClick(note.id)}
              sx={{ cursor: "pointer" }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  fontSize: "1rem",
                  fontWeight: 600,
                  "& mark": {
                    backgroundColor: "#fff59d",
                    fontWeight: 700,
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: highlights.title || note.title,
                }}
              />

              {highlights.body && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    lineHeight: 1.4,
                    "& mark": {
                      backgroundColor: "#fff59d",
                      fontWeight: 600,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: highlights.body }}
                />
              )}

              {highlights.tags && highlights.tags.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  {highlights.tags.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={<span dangerouslySetInnerHTML={{ __html: tag }} />}
                      size="small"
                      color="secondary"
                      sx={{
                        mr: 0.5,
                        mb: 0.5,
                        "& mark": {
                          backgroundColor: "#fff59d",
                          fontWeight: 600,
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Búsqueda
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Encuentra tus notas por título, contenido, tags o categoría
        </Typography>
      </Box>

      {/* Barra de búsqueda principal */}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ position: "relative", mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar en todas las notas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleSearchFocus}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {query && (
                    <IconButton size="small" onClick={clearSearch}>
                      <ClearIcon />
                    </IconButton>
                  )}
                  <Badge
                    badgeContent={
                      hasActiveFilters
                        ? Object.values(filters).flat().length
                        : 0
                    }
                    color="primary"
                  >
                    <IconButton
                      size="small"
                      onClick={() => setShowFilters(!showFilters)}
                      color={showFilters ? "primary" : "default"}
                    >
                      <FilterIcon />
                    </IconButton>
                  </Badge>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                fontSize: "1.1rem",
                backgroundColor: "background.paper",
              },
            }}
          />

          {/* Sugerencias dropdown */}
          <Popper
            open={showSuggestions && suggestions.length > 0}
            anchorEl={anchorEl}
            placement="bottom-start"
            sx={{ zIndex: 1000, width: anchorEl?.clientWidth }}
          >
            <Paper
              elevation={8}
              sx={{
                mt: 0.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              <List dense>
                {suggestions.map((suggestion, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{ py: 1 }}
                    >
                      <HistoryIcon
                        sx={{ mr: 1, fontSize: 16, color: "text.secondary" }}
                      />
                      <ListItemText
                        primary={suggestion}
                        primaryTypographyProps={{
                          fontSize: "0.9rem",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Popper>
        </Box>
      </ClickAwayListener>

      {/* Panel de filtros */}
      <Collapse in={showFilters}>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Filtros
            </Typography>
            <Button
              size="small"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              startIcon={<CloseIcon />}
            >
              Limpiar filtros
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Categorías */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <CategoryIcon fontSize="small" /> Categorías
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {availableFilters.categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    onClick={() => toggleFilterValue("categories", category)}
                    color={
                      filters.categories?.includes(category)
                        ? "primary"
                        : "default"
                    }
                    variant={
                      filters.categories?.includes(category)
                        ? "filled"
                        : "outlined"
                    }
                  />
                ))}
              </Box>
            </Grid>

            {/* Tags */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <TagIcon fontSize="small" /> Tags
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  maxHeight: 120,
                  overflow: "auto",
                }}
              >
                {availableFilters.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onClick={() => toggleFilterValue("tags", tag)}
                    color={
                      filters.tags?.includes(tag) ? "secondary" : "default"
                    }
                    variant={
                      filters.tags?.includes(tag) ? "filled" : "outlined"
                    }
                  />
                ))}
              </Box>
            </Grid>

            {/* Prioridad */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <PriorityIcon fontSize="small" /> Prioridad
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {availableFilters.priorities.map((priority) => (
                  <Chip
                    key={priority}
                    label={
                      priority === "high"
                        ? "Alta"
                        : priority === "medium"
                        ? "Media"
                        : "Baja"
                    }
                    size="small"
                    onClick={() => toggleFilterValue("priorities", priority)}
                    color={
                      priority === "high"
                        ? "error"
                        : priority === "medium"
                        ? "warning"
                        : "success"
                    }
                    variant={
                      filters.priorities?.includes(priority)
                        ? "filled"
                        : "outlined"
                    }
                  />
                ))}
              </Box>
            </Grid>

            {/* Estados */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Estados
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.showFavoritesOnly || false}
                      onChange={(e) =>
                        updateFilter("showFavoritesOnly", e.target.checked)
                      }
                      size="small"
                    />
                  }
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <StarIcon fontSize="small" />
                      <Typography variant="body2">Solo favoritos</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.showPinnedOnly || false}
                      onChange={(e) =>
                        updateFilter("showPinnedOnly", e.target.checked)
                      }
                      size="small"
                    />
                  }
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <PinIcon fontSize="small" />
                      <Typography variant="body2">Solo pineadas</Typography>
                    </Box>
                  }
                />
              </Box>
            </Grid>

            {/* Colores */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <PaletteIcon fontSize="small" /> Colores
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {COLOR_PALETTE.map((color) => (
                  <IconButton
                    key={color}
                    size="small"
                    onClick={() => toggleFilterValue("colors", color)}
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: color,
                      border: filters.colors?.includes(color)
                        ? "2px solid"
                        : "1px solid",
                      borderColor: filters.colors?.includes(color)
                        ? "primary.main"
                        : "divider",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* Barra de progreso mientras busca */}
      {isSearching && <LinearProgress sx={{ mb: 2 }} />}

      {/* Estadísticas de búsqueda */}
      {searchStats.showingFiltered && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {searchStats.resultsCount} de {searchStats.totalNotes} notas
            {query.trim() && ` para "${query}"`}
            {hasActiveFilters && " con filtros aplicados"}
          </Typography>

          {hasActiveFilters && (
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {filters.categories?.map((cat) => (
                <Chip
                  key={`cat-${cat}`}
                  label={cat}
                  size="small"
                  onDelete={() => toggleFilterValue("categories", cat)}
                  color="primary"
                />
              ))}
              {filters.tags?.map((tag) => (
                <Chip
                  key={`tag-${tag}`}
                  label={tag}
                  size="small"
                  onDelete={() => toggleFilterValue("tags", tag)}
                  color="secondary"
                />
              ))}
              {filters.priorities?.map((priority) => (
                <Chip
                  key={`priority-${priority}`}
                  label={priority}
                  size="small"
                  onDelete={() => toggleFilterValue("priorities", priority)}
                  color="warning"
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Resultados */}
      {isEmpty ? (
        <Paper
          sx={{
            p: 8,
            textAlign: "center",
            backgroundColor: "background.default",
            border: "2px dashed",
            borderColor: "divider",
          }}
        >
          <SearchIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Comienza a buscar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Escribe en el campo de búsqueda para encontrar tus notas
          </Typography>
        </Paper>
      ) : !hasResults ? (
        <Paper
          sx={{
            p: 8,
            textAlign: "center",
            backgroundColor: "background.default",
            border: "2px dashed",
            borderColor: "divider",
          }}
        >
          <SearchIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron resultados
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Intenta con otros términos de búsqueda o ajusta los filtros
          </Typography>
          <Button variant="outlined" onClick={clearSearch}>
            Limpiar búsqueda
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {searchResults.map((result) => renderHighlightedResult(result))}
        </Grid>
      )}
    </Box>
  )
}
