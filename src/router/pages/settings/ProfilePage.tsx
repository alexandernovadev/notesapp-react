import React, { useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Divider,
  Alert,
  Paper,
  LinearProgress,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Badge,
  Stack,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  CardHeader,
  CardActions,
} from '@mui/material'
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Web as WebIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Note as NoteIcon,
  Favorite as FavoriteIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
} from '@mui/icons-material'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAuth } from '@/hooks/useAuth'
import { useFileUpload } from '@/hooks/useFileUpload'
import type { ProfileUpdateData, UserPreferences } from '@/types'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export const ProfilePage: React.FC = () => {
  const { profile, isLoading, error, updateProfile, updatePreferences, refreshStats, isUpdating } = useUserProfile()
  const { displayName, email, photoURL } = useAuth()
  const { uploadFiles } = useFileUpload()
  
  const [editMode, setEditMode] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [formData, setFormData] = useState<ProfileUpdateData>({})
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<null | HTMLElement>(null)

  React.useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        phoneNumber: profile.phoneNumber || '',
        occupation: profile.occupation || '',
        company: profile.company || '',
      })
      setPreferences(profile.preferences || {})
    }
  }, [profile])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleInputChange = (field: keyof ProfileUpdateData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handlePreferenceChange = (field: keyof UserPreferences) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setPreferences(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    const success = await updateProfile(formData)
    if (success) {
      setSuccessMessage('Perfil actualizado exitosamente')
      setEditMode(false)
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const handlePreferencesSave = async () => {
    const success = await updatePreferences(preferences)
    if (success) {
      setSuccessMessage('Preferencias actualizadas exitosamente')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarAnchorEl(event.currentTarget)
  }

  const handleAvatarClose = () => {
    setAvatarAnchorEl(null)
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileList = new DataTransfer()
      fileList.items.add(file)
      const urls = await uploadFiles(fileList.files)
      if (urls.length > 0) {
        const success = await updateProfile({ photoURL: urls[0] })
        if (success) {
          setSuccessMessage('Foto de perfil actualizada')
          setTimeout(() => setSuccessMessage(''), 3000)
        }
      }
    }
    handleAvatarClose()
  }

  const handleRefreshStats = async () => {
    await refreshStats()
    setSuccessMessage('Estadísticas actualizadas')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title="Cambiar foto">
                    <IconButton
                      size="small"
                      onClick={handleAvatarClick}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        color: 'primary.main',
                        '&:hover': { backgroundColor: 'white' },
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar
                  src={photoURL || profile?.photoURL || ''}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                  }}
                >
                  {displayName?.charAt(0) || email?.charAt(0) || 'U'}
                </Avatar>
              </Badge>
            </Grid>
            <Grid item flex={1}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {displayName || profile?.displayName || 'Usuario'}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                {email}
              </Typography>
              {profile?.bio && (
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
                  {profile.bio}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                {profile?.location && (
                  <Chip
                    icon={<LocationIcon />}
                    label={profile.location}
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                  />
                )}
                {profile?.occupation && (
                  <Chip
                    icon={<WorkIcon />}
                    label={profile.occupation}
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Main Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            backgroundColor: 'background.default',
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 64,
            },
          }}
        >
          <Tab icon={<PersonIcon />} label="Información Personal" />
          <Tab icon={<TimelineIcon />} label="Estadísticas" />
          <Tab icon={<SettingsIcon />} label="Configuraciones" />
          <Tab icon={<NotificationsIcon />} label="Preferencias" />
        </Tabs>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <PersonalInfoSection
            formData={formData}
            editMode={editMode}
            isUpdating={isUpdating}
            email={email}
            onInputChange={handleInputChange}
            onEdit={() => setEditMode(true)}
            onSave={handleSave}
            onCancel={() => {
              setEditMode(false)
              setFormData({
                displayName: profile?.displayName || '',
                bio: profile?.bio || '',
                location: profile?.location || '',
                website: profile?.website || '',
                phoneNumber: profile?.phoneNumber || '',
                occupation: profile?.occupation || '',
                company: profile?.company || '',
              })
            }}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <StatsSection profile={profile} onRefresh={handleRefreshStats} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ConfigurationSection
            preferences={preferences}
            onPreferenceChange={handlePreferenceChange}
            onSave={handlePreferencesSave}
            isUpdating={isUpdating}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <NotificationSection
            preferences={preferences}
            onPreferenceChange={handlePreferenceChange}
            onSave={handlePreferencesSave}
            isUpdating={isUpdating}
          />
        </TabPanel>
      </Paper>

      {/* Avatar Menu */}
      <Menu
        anchorEl={avatarAnchorEl}
        open={Boolean(avatarAnchorEl)}
        onClose={handleAvatarClose}
      >
        <MenuItem component="label">
          <input
            accept="image/*"
            type="file"
            hidden
            onChange={handleAvatarUpload}
          />
          <ListItemIcon>
            <PhotoCameraIcon />
          </ListItemIcon>
          <ListItemText primary="Subir nueva foto" />
        </MenuItem>
      </Menu>
    </Box>
  )
}

// Personal Information Section Component
const PersonalInfoSection: React.FC<{
  formData: ProfileUpdateData
  editMode: boolean
  isUpdating: boolean
  email: string | null
  onInputChange: (field: keyof ProfileUpdateData) => (event: React.ChangeEvent<HTMLInputElement>) => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}> = ({ formData, editMode, isUpdating, email, onInputChange, onEdit, onSave, onCancel }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Información Personal
        </Typography>
        {!editMode ? (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={onEdit}
            size="small"
          >
            Editar
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={onCancel}
              size="small"
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={onSave}
              disabled={isUpdating}
              size="small"
            >
              {isUpdating ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre completo"
            value={formData.displayName || ''}
            onChange={onInputChange('displayName')}
            disabled={!editMode}
            InputProps={{
              startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            value={email || ''}
            disabled
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Biografía"
            multiline
            rows={3}
            value={formData.bio || ''}
            onChange={onInputChange('bio')}
            disabled={!editMode}
            placeholder="Cuéntanos sobre ti..."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ubicación"
            value={formData.location || ''}
            onChange={onInputChange('location')}
            disabled={!editMode}
            InputProps={{
              startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Sitio web"
            value={formData.website || ''}
            onChange={onInputChange('website')}
            disabled={!editMode}
            InputProps={{
              startAdornment: <WebIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Teléfono"
            value={formData.phoneNumber || ''}
            onChange={onInputChange('phoneNumber')}
            disabled={!editMode}
            InputProps={{
              startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ocupación"
            value={formData.occupation || ''}
            onChange={onInputChange('occupation')}
            disabled={!editMode}
            InputProps={{
              startAdornment: <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Empresa"
            value={formData.company || ''}
            onChange={onInputChange('company')}
            disabled={!editMode}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

// Stats Section Component
const StatsSection: React.FC<{
  profile: any
  onRefresh: () => void
}> = ({ profile, onRefresh }) => {
  const stats = profile?.stats || {}

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Estadísticas
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          size="small"
        >
          Actualizar
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Stats */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Notas Totales"
            value={stats.totalNotes || 0}
            icon={<NoteIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Palabras Escritas"
            value={stats.totalWords || 0}
            icon={<EditIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Favoritas"
            value={stats.favoriteNotes || 0}
            icon={<FavoriteIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Esta Semana"
            value={stats.createdThisWeek || 0}
            icon={<TrendingUpIcon />}
            color="success"
          />
        </Grid>

        {/* Additional Stats */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Actividad"
              avatar={<LocalFireDepartmentIcon color="warning" />}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Este mes:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.createdThisMonth || 0} notas
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Promedio por nota:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.averageNoteLength || 0} palabras
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Categoría favorita:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.mostUsedCategory || 'Ninguna'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Logros"
              avatar={<EmojiEventsIcon color="warning" />}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon color="warning" />
                  <Typography variant="body2">
                    {stats.totalNotes >= 10 ? 'Escritor Activo' : 'Escritor Principiante'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="body2">
                    {stats.totalWords >= 1000 ? 'Mil Palabras' : 'Primeras Palabras'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon color="info" />
                  <Typography variant="body2">
                    {stats.categoriesUsed?.length || 0} categorías utilizadas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

// Stat Card Component
const StatCard: React.FC<{
  title: string
  value: number
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning'
}> = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {value.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

// Configuration Section Component
const ConfigurationSection: React.FC<{
  preferences: Partial<UserPreferences>
  onPreferenceChange: (field: keyof UserPreferences) => (event: React.ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
  isUpdating: boolean
}> = ({ preferences, onPreferenceChange, onSave, isUpdating }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Configuraciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSave}
          disabled={isUpdating}
          size="small"
        >
          {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <PaletteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Apariencia
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Tema</InputLabel>
                  <Select
                    value={preferences.theme || 'light'}
                    onChange={(e) => onPreferenceChange('theme')({ target: { value: e.target.value } } as any)}
                  >
                    <MenuItem value="light">Claro</MenuItem>
                    <MenuItem value="dark">Oscuro</MenuItem>
                    <MenuItem value="auto">Automático</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.compactMode || false}
                      onChange={onPreferenceChange('compactMode')}
                    />
                  }
                  label="Modo compacto"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Editor
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Tamaño de fuente</InputLabel>
                  <Select
                    value={preferences.editorFontSize || 'medium'}
                    onChange={(e) => onPreferenceChange('editorFontSize')({ target: { value: e.target.value } } as any)}
                  >
                    <MenuItem value="small">Pequeño</MenuItem>
                    <MenuItem value="medium">Mediano</MenuItem>
                    <MenuItem value="large">Grande</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.showWordCount || false}
                      onChange={onPreferenceChange('showWordCount')}
                    />
                  }
                  label="Mostrar contador de palabras"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.showReadingTime || false}
                      onChange={onPreferenceChange('showReadingTime')}
                    />
                  }
                  label="Mostrar tiempo de lectura"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

// Notification Section Component
const NotificationSection: React.FC<{
  preferences: Partial<UserPreferences>
  onPreferenceChange: (field: keyof UserPreferences) => (event: React.ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
  isUpdating: boolean
}> = ({ preferences, onPreferenceChange, onSave, isUpdating }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Notificaciones y Preferencias
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSave}
          disabled={isUpdating}
          size="small"
        >
          {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Notificaciones
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.emailNotifications || false}
                      onChange={onPreferenceChange('emailNotifications')}
                    />
                  }
                  label="Notificaciones por email"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.pushNotifications || false}
                      onChange={onPreferenceChange('pushNotifications')}
                    />
                  }
                  label="Notificaciones push"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Comportamiento
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.autoSave || false}
                      onChange={onPreferenceChange('autoSave')}
                    />
                  }
                  label="Guardado automático"
                />
                <FormControl fullWidth>
                  <InputLabel>Idioma</InputLabel>
                  <Select
                    value={preferences.language || 'es'}
                    onChange={(e) => onPreferenceChange('language')({ target: { value: e.target.value } } as any)}
                  >
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
} 