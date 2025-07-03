import React from "react"
import { Box, Typography, Grid, Button, Paper } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useJournal } from "@/hooks/useJournal"
import { NoteCard } from "@/components"
import Swal from "sweetalert2"
import "@/theme/swal2-zindex-fix.css"

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    notes,
    isLoading,
    setActiveNote,
    toggleFavorite,
    togglePinned,
    deleteNote,
  } = useJournal()

  const handleCreateNote = () => {
    navigate("/notes/new")
  }

  const handleToggleFavorite = async (noteId: string) => {
    await toggleFavorite(noteId)
  }

  const handleTogglePinned = async (noteId: string) => {
    await togglePinned(noteId)
  }

  const handleDeleteNote = async (noteId: string) => {
    const result = await Swal.fire({
      title: "¿Eliminar nota?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1", // primary
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
      customClass: {
        popup: "swal2-zindex-fix",
        container: "swal2-zindex-fix",
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
    }
    navigate(`/notes/${noteId}`)
  }

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Cargando notas...
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Mis Notas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {notes.length} {notes.length === 1 ? "nota" : "notas"} en total
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNote}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
            },
          }}
        >
          Nueva Nota
        </Button>
      </Box>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <Paper
          sx={{
            p: 8,
            textAlign: "center",
            backgroundColor: "background.default",
            border: "2px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes notas aún
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comienza creando tu primera nota para organizar tus ideas
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleCreateNote}
            sx={{ borderRadius: 3, px: 3 }}
          >
            Crear Primera Nota
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
              <NoteCard
                note={note}
                onNoteClick={handleNoteClick}
                onToggleFavorite={handleToggleFavorite}
                onTogglePinned={handleTogglePinned}
                onDeleteNote={handleDeleteNote}
                showFavoriteChip={false}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
