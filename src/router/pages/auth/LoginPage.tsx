import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  ArrowForward,
  Login as LoginIcon,
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

export const LoginPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleGoogleLogin = () => {
    console.log('Google login clicked')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        padding: 2,
      }}
    >
      <Slide direction="up" in={true} timeout={800}>
        <Paper
          elevation={24}
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
              padding: 3,
              textAlign: 'center',
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Fade in={true} timeout={1200}>
              <Box>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    boxShadow: theme.shadows[6],
                  }}
                >
                  <LoginIcon sx={{ fontSize: 30, color: 'white' }} />
                </Box>
                <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                  ¡Bienvenido de vuelta!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inicia sesión para acceder a tus notas
                </Typography>
              </Box>
            </Fade>
          </Box>

          {/* Form */}
          <Box sx={{ padding: 3 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Email Field */}
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                {/* Password Field */}
                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                {/* Forgot Password Link */}
                <Box sx={{ textAlign: 'right', mb: 1 }}>
                  <Link
                    component={RouterLink}
                    to="/auth/forgot-password"
                    variant="body2"
                    sx={{
                      textDecoration: 'none',
                      color: theme.palette.primary.main,
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>

                {/* Login Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  endIcon={isLoading ? null : <ArrowForward />}
                  sx={{
                    borderRadius: 1.5,
                    py: 1.2,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      transform: 'translateY(-1px)',
                      boxShadow: theme.shadows[6],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>

                {/* Divider */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 1.5 }}>
                  <Divider sx={{ flex: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    o continúa con
                  </Typography>
                  <Divider sx={{ flex: 1 }} />
                </Box>

                {/* Google Login Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleGoogleLogin}
                  startIcon={<Google />}
                  sx={{
                    borderRadius: 1.5,
                    py: 1.2,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: theme.palette.primary.main + '08',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Continuar con Google
                </Button>

                {/* Sign Up Link */}
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    ¿No tienes una cuenta?{' '}
                    <Link
                      component={RouterLink}
                      to="/auth/register"
                      sx={{
                        textDecoration: 'none',
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Regístrate aquí
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </form>
          </Box>
        </Paper>
      </Slide>
    </Box>
  )
} 