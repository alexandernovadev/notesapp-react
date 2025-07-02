import React from 'react'
import {
  Box,
  Typography,
  Link,
  IconButton,
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
import { Link as RouterLink } from 'react-router-dom'
import {
  AuthCard,
  AuthHeader,
  AuthFormContainer,
  AuthButton,
  AuthTextField,
  AuthDivider,
} from '@/components/auth'
import { useAuthForm, usePasswordVisibility } from '@/hooks'

interface LoginFormData {
  email: string
  password: string
}

export const LoginPage: React.FC = () => {
  const { formData, errors, isLoading, handleInputChange, handleSubmit } = useAuthForm<LoginFormData>({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      // TODO: Implement real login logic
      console.log('Login attempt:', values)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  })

  const { isVisible, toggleVisibility } = usePasswordVisibility(['password'])

  const handleGoogleLogin = () => {
    console.log('Google login clicked')
  }

  return (
    <AuthCard>
      <AuthHeader
        icon={<Login sx={{ fontSize: 30, color: 'white' }} />}
        title="¡Bienvenido de vuelta!"
        subtitle="Inicia sesión para acceder a tus notas"
      />

      <AuthFormContainer>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <AuthTextField
              label="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              startIcon={<Email color="action" fontSize="small" />}
            />

            <AuthTextField
              label="Contraseña"
              type={isVisible('password') ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              startIcon={<Lock color="action" fontSize="small" />}
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

            <Box sx={{ textAlign: 'right', mb: 1 }}>
              <Link
                component={RouterLink}
                to="/auth/forgot-password"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontSize: '0.875rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

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

            <Box sx={{ textAlign: 'center', mt: 1 }}>
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
          </Box>
        </form>
      </AuthFormContainer>
    </AuthCard>
  )
} 