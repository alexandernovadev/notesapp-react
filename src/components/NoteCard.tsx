import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  PushPin as PushPinIcon,
  PushPinOutlined as PushPinOutlinedIcon,
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Note {
  id: string
  title: string
  body: string
  imageUrls?: string[]
  category?: string
  tags?: string[]
  color?: string
  priority?: 'low' | 'medium' | 'high'
  isFavorite?: boolean
  isPinned?: boolean
  wordCount?: number
  readTime?: number
  updatedAt: number
}

interface NoteCardProps {
  note: Note
  onNoteClick: (noteId: string) => void
  onToggleFavorite: (noteId: string) => void
  onTogglePinned: (noteId: string) => void
  onDeleteNote: (noteId: string) => void
  showFavoriteChip?: boolean // Para mostrar el chip "Favorito" en la página de favoritos
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onNoteClick,
  onToggleFavorite,
  onTogglePinned,
  onDeleteNote,
  showFavoriteChip = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleMenuClose()
    onNoteClick(note.id)
  }

  const handleDelete = () => {
    handleMenuClose()
    onDeleteNote(note.id)
  }

  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: es,
    })
  }

  const getPreviewText = (text: string) => {
    if (!text) return 'Sin contenido'
    const plainText = text.replace(/<[^>]*>/g, '').replace(/\n/g, ' ')
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
      onClick={() => onNoteClick(note.id)}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* COLOR CIRCLE GRANDE + ICONS */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: note.color || '#f8fafc',
              border: '2px solid',
              borderColor: 'divider',
              flexShrink: 0
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(note.id)
              }}
              sx={{ p: 0.25 }}
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
                onTogglePinned(note.id)
              }}
              sx={{ p: 0.25 }}
            >
              {note.isPinned ? (
                <PushPinIcon fontSize="small" color="primary" />
              ) : (
                <PushPinOutlinedIcon fontSize="small" />
              )}
            </IconButton>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ p: 0.25 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* TITLE */}
        <Typography 
          variant="subtitle1" 
          component="h3" 
          sx={{ 
            fontWeight: 600,
            lineHeight: 1.2,
            color: 'text.primary',
            mb: 1.2,
            wordBreak: 'break-word'
          }}
        >
          {note.title || 'Sin título'}
        </Typography>

        {/* Image Preview */}
        {note.imageUrls && note.imageUrls.length > 0 && (
          <Box sx={{ mb: 1.2 }}>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {note.imageUrls.slice(0, 3).map((url, index) => (
                <Avatar
                  key={index}
                  src={url}
                  variant="rounded"
                  sx={{
                    width: 50,
                    height: 50,
                    border: '2px solid',
                    borderColor: 'divider',
                    boxShadow: 1,
                  }}
                />
              ))}
              {note.imageUrls.length > 3 && (
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: 'action.hover',
                    border: '2px solid',
                    borderColor: 'divider',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  +{note.imageUrls.length - 3}
                </Avatar>
              )}
            </Box>
          </Box>
        )}

        {/* Content Preview */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.2,
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {getPreviewText(note.body)}
        </Typography>

        {/* FIRST DIVIDER */}
        <Box sx={{ 
          borderTop: '1px solid',
          borderColor: 'divider',
          pt: 1,
          mb: 1,
          mt: 'auto'
        }}>
          {/* FECHA */}
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            {formatDate(note.updatedAt)}
          </Typography>
          
          {/* COUNT + RELOJ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 12, color: 'action.active' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
              {note.wordCount || 0} palabras
            </Typography>
            {note.readTime && (
              <>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>•</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                  {note.readTime} min lectura
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {/* SECOND DIVIDER - Tags y Categoría */}
        {((note.tags && note.tags.length > 0) || (note.category && note.category !== 'personal') || (note.priority && note.priority !== 'medium') || showFavoriteChip) && (
          <Box sx={{ 
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 1
          }}>
            {/* TAGS Y CATEGORIA */}
            {((note.tags && note.tags.length > 0) || (note.category && note.category !== 'personal')) && (
              <Box sx={{ mb: ((note.priority && note.priority !== 'medium') || showFavoriteChip) ? 1 : 0 }}>
                {/* TAGS */}
                {note.tags && note.tags.length > 0 && (
                  <Box sx={{ mb: note.category && note.category !== 'personal' ? 0.75 : 0 }}>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5, display: 'block' }}>
                      tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25 }}>
                      {note.tags.slice(0, 4).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="filled"
                          color="secondary"
                          sx={{
                            fontSize: '0.6rem',
                            height: 18,
                            opacity: 0.8,
                            '& .MuiChip-label': { px: 0.75 }
                          }}
                        />
                      ))}
                      {note.tags && note.tags.length > 4 && (
                        <Chip
                          label={`+${note.tags.length - 4}`}
                          size="small"
                          sx={{
                            fontSize: '0.6rem',
                            height: 18,
                            bgcolor: 'text.secondary',
                            color: 'white',
                            '& .MuiChip-label': { px: 0.75 }
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                )}
                
                {/* CATEGORIA */}
                {note.category && note.category !== 'personal' && (
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5, display: 'block' }}>
                      categoría
                    </Typography>
                    <Chip
                      label={note.category}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.6rem',
                        height: 18,
                        bgcolor: 'background.paper',
                        opacity: 0.9,
                        '& .MuiChip-label': { px: 0.75 }
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* PRIORIDAD Y FAVORITO */}
            {((note.priority && note.priority !== 'medium') || showFavoriteChip) && (
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.25,
                alignItems: 'center'
              }}>
                {/* Favorite indicator first - only in favorites page */}
                {showFavoriteChip && (
                  <Chip
                    icon={<StarIcon />}
                    label="Favorito"
                    size="small"
                    variant="filled"
                    color="primary"
                    sx={{
                      fontSize: '0.65rem',
                      height: 20,
                      fontWeight: 600
                    }}
                  />
                )}
                
                {note.priority && note.priority !== 'medium' && (
                  <Chip
                    label={note.priority === 'high' ? 'Alta Prioridad' : 'Baja Prioridad'}
                    size="small"
                    sx={{
                      fontSize: '0.65rem',
                      height: 20,
                      bgcolor: note.priority === 'high' ? 'error.main' : 'success.main',
                      color: 'white',
                      ml: showFavoriteChip ? 0.5 : 0
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
        )}
      </CardContent>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  )
} 