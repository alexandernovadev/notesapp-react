import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material'
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Timeline as TimelineIcon,
  Shield as ShieldIcon,
  VolumeUp as VolumeUpIcon,
  Brightness4 as Brightness4Icon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ProfilePage } from './ProfilePage'

const settingsMenu = [
  {
    id: 'profile',
    title: 'Mi Perfil',
    description: 'Información personal, estadísticas y configuración avanzada',
    icon: PersonIcon,
    color: 'primary',
    premium: true,
  },
  {
    id: 'security',
    title: 'Seguridad',
    description: 'Contraseña, autenticación y privacidad',
    icon: SecurityIcon,
    color: 'error',
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    description: 'Gestionar alertas y recordatorios',
    icon: NotificationsIcon,
    color: 'info',
  },
  {
    id: 'appearance',
    title: 'Apariencia',
    description: 'Tema, colores y personalización',
    icon: PaletteIcon,
    color: 'secondary',
  },
  {
    id: 'language',
    title: 'Idioma',
    description: 'Cambiar idioma de la aplicación',
    icon: LanguageIcon,
    color: 'success',
  },
  {
    id: 'storage',
    title: 'Almacenamiento',
    description: 'Gestionar archivos y espacio utilizado',
    icon: StorageIcon,
    color: 'warning',
  },
  {
    id: 'help',
    title: 'Ayuda',
    description: 'Tutoriales y preguntas frecuentes',
    icon: HelpIcon,
    color: 'info',
  },
  {
    id: 'about',
    title: 'Acerca de',
    description: 'Información de la aplicación',
    icon: InfoIcon,
    color: 'default',
  },
]

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const { displayName, email, photoURL } = useAuth()
  
  const [selectedSection, setSelectedSection] = useState(() => {
    const pathSegments = location.pathname.split('/')
    return pathSegments[pathSegments.length - 1] || 'main'
  })

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'profile') {
      setSelectedSection('profile')
      navigate('/settings/profile')
    } else {
      setSelectedSection(sectionId)
      // For now, just update the selected section
      // In the future, you can navigate to specific settings sections
    }
  }

  // If we're on the profile page, render the ProfilePage component
  if (selectedSection === 'profile' || location.pathname.includes('/settings/profile')) {
    return <ProfilePage />
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          p: 4,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={photoURL || ''}
            sx={{
              width: 80,
              height: 80,
              border: '3px solid rgba(255,255,255,0.3)',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            {displayName?.charAt(0) || email?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Configuración
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Personaliza tu experiencia con {displayName || 'NotesApp'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Settings Grid */}
      <Grid container spacing={3}>
        {settingsMenu.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
              onClick={() => handleSectionClick(item.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: `${item.color}.light`,
                      color: `${item.color}.main`,
                    }}
                  >
                    <item.icon />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {item.title}
                      </Typography>
                      {item.premium && (
                        <Chip
                          label="Premium"
                          size="small"
                          sx={{
                            backgroundColor: 'gold',
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: '0.65rem',
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Acciones Rápidas
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AccountCircleIcon />}
              onClick={() => handleSectionClick('profile')}
              sx={{ justifyContent: 'flex-start', p: 1.5 }}
            >
              Ver Mi Perfil
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ShieldIcon />}
              onClick={() => handleSectionClick('security')}
              sx={{ justifyContent: 'flex-start', p: 1.5 }}
            >
              Seguridad
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<VolumeUpIcon />}
              onClick={() => handleSectionClick('notifications')}
              sx={{ justifyContent: 'flex-start', p: 1.5 }}
            >
              Notificaciones
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Brightness4Icon />}
              onClick={() => handleSectionClick('appearance')}
              sx={{ justifyContent: 'flex-start', p: 1.5 }}
            >
              Tema
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Development Notice */}
      <Paper sx={{ p: 3, mt: 3, borderRadius: 2, backgroundColor: 'info.light' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🚧 En Desarrollo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          La página de <strong>Mi Perfil</strong> está completamente funcional con diseño premium. 
          Las demás secciones están en desarrollo y se habilitarán próximamente.
        </Typography>
      </Paper>
    </Box>
  )
} 