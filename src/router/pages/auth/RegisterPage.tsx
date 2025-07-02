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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Google,
  ArrowForward,
  PersonAdd,
  CheckCircle,
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

export const RegisterPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<{ 
    displayName?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string 
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const steps = ['Personal', 'Credenciales', 'Confirmar']

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleTogglePassword = (field: 'password' | 'confirmPassword') => () => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleGoogleRegister = () => {
    console.log('Google register clicked')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <TextField
            fullWidth
            label="Nombre completo"
            value={formData.displayName}
            onChange={handleInputChange('displayName')}
            error={!!errors.displayName}
            helperText={errors.displayName}
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" fontSize="small" />
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
        )
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                      onClick={handleTogglePassword('password')}
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
          </Box>
        )
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Confirmar contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
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
                      onClick={handleTogglePassword('confirmPassword')}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
            
            {/* Summary */}
            <Box
              sx={{
                background: theme.palette.background.default,
                borderRadius: 1.5,
                padding: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Resumen:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">
                    <strong>Nombre:</strong> {formData.displayName || 'No especificado'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">
                    <strong>Email:</strong> {formData.email || 'No especificado'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">
                    <strong>Contraseña:</strong> {formData.password ? '••••••••' : 'No especificada'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )
      default:
        return null
    }
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
            maxWidth: 450,
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
                  <PersonAdd sx={{ fontSize: 30, color: 'white' }} />
                </Box>
                <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                  ¡Únete a nosotros!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Crea tu cuenta para empezar a organizar tus notas
                </Typography>
              </Box>
            </Fade>
          </Box>

          {/* Stepper */}
          <Box sx={{ padding: 2, paddingBottom: 1 }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Form */}
          <Box sx={{ padding: 3 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Step Content */}
                <Fade in={true} timeout={500}>
                  <Box>
                    {renderStepContent()}
                  </Box>
                </Fade>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {currentStep > 0 && (
                    <Button
                      onClick={handleBack}
                      variant="outlined"
                      sx={{
                        flex: 1,
                        borderRadius: 1.5,
                        py: 1.2,
                        textTransform: 'none',
                      }}
                    >
                      Atrás
                    </Button>
                  )}
                  
                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      sx={{
                        flex: 1,
                        borderRadius: 1.5,
                        py: 1.2,
                        textTransform: 'none',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                        },
                      }}
                    >
                      Siguiente
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      endIcon={isLoading ? null : <ArrowForward />}
                      sx={{
                        flex: 1,
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
                      {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </Button>
                  )}
                </Box>

                {/* Divider */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 1.5 }}>
                  <Divider sx={{ flex: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    o continúa con
                  </Typography>
                  <Divider sx={{ flex: 1 }} />
                </Box>

                {/* Google Register Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleGoogleRegister}
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
                  Registrarse con Google
                </Button>

                {/* Sign In Link */}
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    ¿Ya tienes una cuenta?{' '}
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