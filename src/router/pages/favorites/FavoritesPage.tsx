import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Fade,
} from '@mui/material'
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PushPin as PushPinIcon,
  PushPinOutlined as PushPinOutlinedIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useJournal } from '@/hooks/useJournal'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate()
  const { notes, setActiveNote, toggleFavorite, togglePinned, deleteNote } = useJournal()

  // Menu state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedNoteId, setSelectedNoteId] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState('')

  // Ordenar: fijados primero, luego por fecha de actualización descendente
  const favoriteNotes = notes
    .filter((note) => note.isFavorite)
    .filter((note) => {
      const q = search.toLowerCase()
      return (
        note.title.toLowerCase().includes(q) ||
        note.body.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.updatedAt - a.updatedAt
    })

  const handleEditNote = (noteId: string) => {
    navigate(`/notes/${noteId}`)
  }

  const handleToggleFavorite = async (noteId: string) => {
    await toggleFavorite(noteId)
  }

  const handleTogglePinned = async (noteId: string) => {
    await togglePinned(noteId)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, noteId: string) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedNoteId(noteId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedNoteId(null)
  }

  const handleDeleteNote = async () => {
    if (selectedNoteId) {
      await deleteNote(selectedNoteId)
      handleMenuClose()
    }
  }

  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(timestamp, {
      addSuffix: true,
      locale: es,
    })
  }

  const handleNoteClick = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      setActiveNote(note)
      navigate(`/notes/${note.id}`)
    }
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Favoritos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {favoriteNotes.length} {favoriteNotes.length === 1 ? 'nota favorita' : 'notas favoritas'}
      </Typography>
      <TextField
        placeholder="Buscar en favoritos..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 4, maxWidth: 400 }}
      />
      {favoriteNotes.length === 0 ? (
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            backgroundColor: 'background.default',
            border: '2px dashed',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes notas favoritas aún
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Marca notas como favoritas para verlas aquí
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {favoriteNotes.map((note) => (
            <Fade in key={note.id} timeout={500}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => handleNoteClick(note.id)}
                >
                  {/* Note Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                        flex: 1,
                        mr: 1,
                      }}
                    >
                      {note.title || 'Sin título'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(note.id)
                        }}
                        sx={{ p: 0.5 }}
                      >
                        {note.isFavorite ? (
                          <StarIcon fontSize="small" color="primary" />
                        ) : (
                          <StarBorderIcon fontSize="small" />
                        )}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTogglePinned(note.id)
                        }}
                        sx={{ p: 0.5 }}
                      >
                        {note.isPinned ? (
                          <PushPinIcon fontSize="small" color="primary" />
                        ) : (
                          <PushPinOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, note.id)}
                        sx={{ p: 0.5 }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  {/* Note Content */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                    }}
                    component="div"
                  >
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                      }}
                      dangerouslySetInnerHTML={{ __html: note.body || '<em>Sin contenido</em>' }}
                    />
                  </Typography>
                  {/* Note Footer */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 'auto',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* Badge de prioridad */}
                      {note.priority === 'high' && (
                        <Chip label="Alta" size="small" sx={{ bgcolor: 'error.main', color: 'white', fontWeight: 700 }} />
                      )}
                      {note.priority === 'medium' && (
                        <Chip label="Media" size="small" sx={{ bgcolor: 'warning.main', color: 'white', fontWeight: 700 }} />
                      )}
                      {note.priority === 'low' && (
                        <Chip label="Baja" size="small" sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 700 }} />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(note.updatedAt)}
                    </Typography>
                    {note.imageUrls && note.imageUrls.length > 0 && (
                      <Chip
                        label={`${note.imageUrls.length} imagen${note.imageUrls.length > 1 ? 'es' : ''}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Fade>
          ))}
        </Grid>
      )}
      {/* Note Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            borderRadius: 2,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedNoteId) {
              handleEditNote(selectedNoteId)
              handleMenuClose()
            }
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteNote} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
} 