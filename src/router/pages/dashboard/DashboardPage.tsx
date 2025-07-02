import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Chip,
  IconButton,
  useTheme
} from '@mui/material'
import {
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useJournalStore } from '@/stores/useJournalStore'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export const DashboardPage: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { notes, isLoading, setActiveNote } = useJournalStore()

  const handleCreateNote = () => {
    navigate('/notes/new')
  }

  const handleEditNote = (noteId: string) => {
    navigate(`/notes/${noteId}`)
  }

  const handleNoteClick = (note: any) => {
    setActiveNote(note)
    navigate(`/notes/${note.id}`)
  }

  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { 
      addSuffix: true, 
      locale: es 
    })
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Cargando notas...
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Mis Notas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {notes.length} {notes.length === 1 ? 'nota' : 'notas'} en total
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
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)'
            }
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
            textAlign: 'center',
            backgroundColor: 'background.default',
            border: '2px dashed',
            borderColor: 'divider'
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
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => handleNoteClick(note)}
              >
                {/* Note Header */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  mb: 2 
                }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 600,
                      lineHeight: 1.3,
                      flex: 1,
                      mr: 1
                    }}
                  >
                    {note.title || 'Sin título'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Toggle favorite
                      }}
                      sx={{ p: 0.5 }}
                    >
                      <StarBorderIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditNote(note.id)
                      }}
                      sx={{ p: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
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
                    overflow: 'hidden'
                  }}
                >
                  {truncateText(note.body || 'Sin contenido')}
                </Typography>

                {/* Note Footer */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 'auto'
                }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(note.date)}
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
          ))}
        </Grid>
      )}
    </Box>
  )
} 