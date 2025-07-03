import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Fade,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useJournal } from '@/hooks/useJournal'
import { NoteCard } from '@/components'
import Swal from 'sweetalert2'
import '@/theme/swal2-zindex-fix.css'

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate()
  const { notes, setActiveNote, toggleFavorite, togglePinned, deleteNote } = useJournal()

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

  const handleToggleFavorite = async (noteId: string) => {
    await toggleFavorite(noteId)
  }

  const handleTogglePinned = async (noteId: string) => {
    await togglePinned(noteId)
  }

  const handleDeleteNote = async (noteId: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar nota?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1', // primary
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      focusCancel: true,
      customClass: {
        popup: 'swal2-zindex-fix',
        container: 'swal2-zindex-fix',
      },
    })
    if (result.isConfirmed) {
      await deleteNote(noteId)
    }
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
                <NoteCard
                  note={note}
                  onNoteClick={handleNoteClick}
                  onToggleFavorite={handleToggleFavorite}
                  onTogglePinned={handleTogglePinned}
                  onDeleteNote={handleDeleteNote}
                  showFavoriteChip={true}
                />
              </Grid>
            </Fade>
          ))}
        </Grid>
      )}
    </Box>
  )
} 