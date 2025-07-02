import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Alert,
  InputAdornment,
} from '@mui/material'
import {
  Email,
  ArrowForward,
  LockReset,
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

export const ForgotPasswordPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico')
      return
    }

    setIsLoading(true)
    setError(null)
    
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  const handleResend = () => {
    setIsSubmitted(false)
    setEmail('')
  }

  if (isSubmitted) {
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
                background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
              },
            }}
          >
            {/* Success Header */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.primary.main}15)`,
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
                      background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                      boxShadow: theme.shadows[6],
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 30, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    ¡Email enviado!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Revisa tu bandeja de entrada para restablecer tu contraseña
                  </Typography>
                </Box>
              </Fade>
            </Box>

            {/* Success Content */}
            <Box sx={{ padding: 3 }}>
              <Fade in={true} timeout={800}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Alert 
                    severity="success" 
                    icon={<CheckCircle />}
                    sx={{ borderRadius: 1.5 }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Instrucciones enviadas a:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {email}
                    </Typography>
                  </Alert>

                  <Box
                    sx={{
                      background: theme.palette.background.default,
                      borderRadius: 1.5,
                      padding: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      ¿Qué sigue?
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: 0.2,
                          }}
                        >
                          <Typography variant="caption" color="white" fontWeight="bold">
                            1
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Revisa tu correo en <strong>{email}</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: 0.2,
                          }}
                        >
                          <Typography variant="caption" color="white" fontWeight="bold">
                            2
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Haz clic en el enlace de restablecimiento
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: 0.2,
                          }}
                        >
                          <Typography variant="caption" color="white" fontWeight="bold">
                            3
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Crea una nueva contraseña segura
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    ¿No recibiste el email? Revisa tu carpeta de spam o{' '}
                    <Link
                      component="button"
                      onClick={handleResend}
                      sx={{
                        textDecoration: 'none',
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      intenta de nuevo
                    </Link>
                  </Typography>

                  <Button
                    component={RouterLink}
                    to="/auth/login"
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    fullWidth
                    sx={{
                      borderRadius: 1.5,
                      py: 1.2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Volver al inicio de sesión
                  </Button>
                </Box>
              </Fade>
            </Box>
          </Paper>
        </Slide>
      </Box>
    )
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
                  <LockReset sx={{ fontSize: 30, color: 'white' }} />
                </Box>
                <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                  ¿Olvidaste tu contraseña?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No te preocupes, te ayudamos a recuperarla
                </Typography>
              </Box>
            </Fade>
          </Box>

          {/* Form */}
          <Box sx={{ padding: 3 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </Typography>

                {/* Email Field */}
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  error={!!error}
                  helperText={error}
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

                {/* Submit Button */}
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
                  {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </Button>

                {/* Back to Login */}
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    ¿Recordaste tu contraseña?{' '}
                    <Link
                      component={RouterLink}
                      to="/auth/login"
                      sx={{
                        textDecoration: 'none',
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Inicia sesión aquí
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