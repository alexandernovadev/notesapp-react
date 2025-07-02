import React, { useState } from 'react'
import {
  Box,
  Typography,
  Link,
  IconButton,
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
import {
  AuthCard,
  AuthHeader,
  AuthFormContainer,
  AuthButton,
  AuthTextField,
  AuthDivider,
} from '@/components/auth'
import { useAuthForm, usePasswordVisibility } from '@/hooks'

interface RegisterFormData {
  displayName: string
  email: string
  password: string
  confirmPassword: string
}

export const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const { formData, errors, isLoading, handleInputChange, handleSubmit } = useAuthForm<RegisterFormData>({
    initialValues: { displayName: '', email: '', password: '', confirmPassword: '' },
    onSubmit: async (values) => {
      // TODO: Implement real registration logic
      console.log('Register attempt:', values)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  })

  const { isVisible, toggleVisibility } = usePasswordVisibility(['password', 'confirmPassword'])

  const steps = ['Personal', 'Credenciales', 'Confirmar']

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

  const handleGoogleRegister = () => {
    console.log('Google register clicked')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <AuthTextField
            label="Nombre completo"
            value={formData.displayName}
            onChange={handleInputChange('displayName')}
            error={!!errors.displayName}
            helperText={errors.displayName}
            startIcon={<Person color="action" fontSize="small" />}
            autoComplete="name"
          />
        )
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AuthTextField
              label="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              startIcon={<Email color="action" fontSize="small" />}
              autoComplete="email"
            />
            <AuthTextField
              label="Contraseña"
              type={isVisible('password') ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              startIcon={<Lock color="action" fontSize="small" />}
              autoComplete="new-password"
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
          </Box>
        )
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AuthTextField
              label="Confirmar contraseña"
              type={isVisible('confirmPassword') ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              startIcon={<Lock color="action" fontSize="small" />}
              autoComplete="new-password"
              endIcon={
                <IconButton
                  onClick={() => toggleVisibility('confirmPassword')}
                  edge="end"
                  size="small"
                >
                  {isVisible('confirmPassword') ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              }
            />
            
            {/* Summary */}
            <Box
              sx={{
                background: 'background.default',
                borderRadius: 1.5,
                padding: 2,
                border: '1px solid',
                borderColor: 'divider',
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
    <AuthCard maxWidth={450}>
      <AuthHeader
        icon={<PersonAdd sx={{ fontSize: 30, color: 'white' }} />}
        title="¡Únete a nosotros!"
        subtitle="Crea tu cuenta para empezar a organizar tus notas"
      />

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

      <AuthFormContainer>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Step Content */}
            <Box>
              {renderStepContent()}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              {currentStep > 0 && (
                <AuthButton
                  variant="outlined"
                  onClick={handleBack}
                  fullWidth
                >
                  Atrás
                </AuthButton>
              )}
              
              {currentStep < steps.length - 1 ? (
                <AuthButton
                  onClick={handleNext}
                  fullWidth
                >
                  Siguiente
                </AuthButton>
              ) : (
                <AuthButton
                  type="submit"
                  loading={isLoading}
                  endIcon={<ArrowForward />}
                  fullWidth
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </AuthButton>
              )}
            </Box>

            <AuthDivider />

            <AuthButton
              variant="outlined"
              onClick={handleGoogleRegister}
              startIcon={<Google />}
            >
              Registrarse con Google
            </AuthButton>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  component={RouterLink}
                  to="/auth/login"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
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
      </AuthFormContainer>
    </AuthCard>
  )
} 