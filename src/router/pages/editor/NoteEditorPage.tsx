import React from 'react'
import {
  Box,
  TextField,
  Typography,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { NoteEditor } from '@/components/editor'
import { useNoteEditor } from '@/hooks/useNoteEditor'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export const NoteEditorPage: React.FC = () => {
  const navigate = useNavigate()
  const { noteId } = useParams<{ noteId: string }>()
  
  const {
    content,
    title,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    messageSaved,
    setContent,
    setTitle,
    save,
  } = useNoteEditor({
    noteId: noteId || undefined,
    autoSave: true,
    autoSaveDelay: 2000,
  })

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('¿Deseas salir sin guardar los cambios?')
      if (!confirmed) return
    }
    navigate('/')
  }

  const handleSave = async () => {
    await save()
  }

  // Debug: log content and title when they change
  React.useEffect(() => {
    console.log('NoteEditorPage debug:', { noteId, title, content })
  }, [noteId, title, content])

  // Estado para mostrar/ocultar el Alert de guardado
  const [showAlert, setShowAlert] = React.useState(false)
  React.useEffect(() => {
    if (messageSaved) setShowAlert(true)
  }, [messageSaved])

  // Mostrar loading si hay noteId pero el contenido está vacío y no se está guardando
  if (noteId && !content && !isSaving) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">Cargando nota...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="h1">
            {noteId ? 'Editar Nota' : 'Nueva Nota'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Status indicators */}
          {isSaving && (
            <Chip
              label="Guardando..."
              size="small"
              color="info"
              variant="outlined"
            />
          )}
          
          {lastSaved && !isSaving && (
            <Chip
              icon={<CheckCircleIcon />}
              label={`Guardado ${formatDistanceToNow(lastSaved, { addSuffix: true, locale: es })}`}
              size="small"
              color="success"
              variant="outlined"
            />
          )}

          {hasUnsavedChanges && (
            <Chip
              label="Cambios sin guardar"
              size="small"
              color="warning"
              variant="outlined"
            />
          )}

          {/* Save button */}
          <Tooltip title="Guardar (Ctrl+S)" arrow>
            {(isSaving || !hasUnsavedChanges) ? (
              <span>
                <IconButton
                  onClick={handleSave}
                  disabled
                  color="primary"
                >
                  <SaveIcon />
                </IconButton>
              </span>
            ) : (
              <IconButton
                onClick={handleSave}
                color="primary"
              >
                <SaveIcon />
              </IconButton>
            )}
          </Tooltip>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, gap: 2 }}>
        {/* Title */}
        <TextField
          fullWidth
          placeholder="Título de la nota..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '1.5rem',
              fontWeight: 600,
            },
          }}
        />

        {/* Success message */}
        {messageSaved && showAlert && (
          <Alert severity="success" onClose={() => setShowAlert(false)}>
            {messageSaved}
          </Alert>
        )}

        {/* Editor */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <NoteEditor
            content={content}
            onUpdate={setContent}
            placeholder="Comienza a escribir tu nota..."
            autoFocus={!noteId} // Auto focus only for new notes
          />
        </Box>
      </Box>
    </Box>
  )
}
