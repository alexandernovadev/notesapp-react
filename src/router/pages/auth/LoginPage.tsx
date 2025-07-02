import React from 'react'
import {
  Box,
  Typography,
  Link,
  IconButton,
  Alert,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  ArrowForward,
  Login,
} from '@mui/icons-material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  AuthCard,
  AuthHeader,
  AuthFormContainer,
  AuthButton,
  AuthTextField,
  AuthDivider,
} from '@/components/auth'
import { useAuthForm, usePasswordVisibility } from '@/hooks'
import { useAuth } from '@/hooks/useAuth'

interface LoginFormData {
  email: string
  password: string
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, loginWithGoogle, errorMessage, clearError, isAuthenticated } = useAuth()
  const { isVisible, toggleVisibility } = usePasswordVisibility(['password'])
  


  const { formData, errors, isLoading, handleInputChange, handleSubmit, setError, clearErrors } = useAuthForm<LoginFormData>({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      // Validar antes de enviar
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isValidEmail = emailRegex.test(values.email)
      const isValidPassword = values.password.length >= 6
      
      if (!isValidEmail) {
        setError('email', 'Ingresa un email válido')
        return
      }
      
      if (!isValidPassword) {
        setError('password', 'La contraseña debe tener al menos 6 caracteres')
        return
      }
      
      const result = await login(values.email, values.password)
      
      if (result.ok) {
        navigate('/')
      }
      // Si hay error, se maneja automáticamente en el store
    }
  })

  const handleGoogleLogin = async () => {
    clearError()
    const result = await loginWithGoogle()
    
    if (result.ok) {
      navigate('/')
    }
  }



  // Si ya está autenticado, redirigir
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <AuthCard>
      <AuthHeader
        icon={<Login sx={{ fontSize: 30, color: 'white' }} />}
        title="¡Bienvenido de vuelta!"
        subtitle="Inicia sesión para acceder a tus notas"
      />

      <AuthFormContainer>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Error Alert */}
            {errorMessage && (
              <Alert 
                severity="error" 
                onClose={clearError}
                sx={{ mb: 2 }}
              >
                {errorMessage}
              </Alert>
            )}



            <AuthTextField
              label="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              startIcon={<Email color="action" fontSize="small" />}
              autoComplete="username"
            />

            <AuthTextField
              label="Contraseña"
              type={isVisible('password') ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              startIcon={<Lock color="action" fontSize="small" />}
              autoComplete="current-password"
              endIcon={
                <IconButton
                  onClick={() => toggleVisibility('password')}
                  edge="end"
                  size="small"
                >
                  {isVisible('password') ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              }
            />

            <AuthButton
              type="submit"
              loading={isLoading}
              endIcon={<ArrowForward />}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </AuthButton>

            <AuthDivider />

            <AuthButton
              variant="outlined"
              onClick={handleGoogleLogin}
              startIcon={<Google />}
            >
              Continuar con Google
            </AuthButton>

            <Box sx={{ textAlign: 'center', mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes una cuenta?{' '}
                <Link
                  component={RouterLink}
                  to="/auth/register"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
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

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/auth/forgot-password"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>
          </Box>
        </form>
      </AuthFormContainer>
    </AuthCard>
  )
} 