import React, { useState } from "react"
import { Box, Typography, Link, Alert } from "@mui/material"
import {
  Email,
  ArrowForward,
  LockReset,
  CheckCircle,
  ArrowBack,
} from "@mui/icons-material"
import { Link as RouterLink } from "react-router-dom"
import {
  AuthCard,
  AuthHeader,
  AuthFormContainer,
  AuthButton,
  AuthTextField,
} from "@/components/auth"
import { useAuthForm } from "@/hooks"

interface ForgotPasswordFormData {
  email: string
}

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { formData, errors, isLoading, handleInputChange, handleSubmit } =
    useAuthForm<ForgotPasswordFormData>({
      initialValues: { email: "" },
      onSubmit: async (values) => {
        if (!values.email.trim()) {
          throw new Error("Por favor ingresa tu correo electrónico")
        }

        // TODO: Implement real password reset logic
        console.log("Password reset attempt:", values)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsSubmitted(true)
      },
    })

  const handleResend = () => {
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <AuthCard>
        <AuthHeader
          icon={<CheckCircle sx={{ fontSize: 30, color: "white" }} />}
          title="¡Email enviado!"
          subtitle="Revisa tu bandeja de entrada para restablecer tu contraseña"
          iconColor="success"
        />

        <AuthFormContainer>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Alert
              severity="success"
              icon={<CheckCircle />}
              sx={{ borderRadius: 1.5 }}
            >
              <Typography variant="body2" fontWeight="bold">
                Instrucciones enviadas a:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.email}
              </Typography>
            </Alert>

            <Box
              sx={{
                background: "background.default",
                borderRadius: 1.5,
                padding: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                ¿Qué sigue?
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      mt: 0.2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="white"
                      fontWeight="bold"
                    >
                      1
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Revisa tu correo en <strong>{formData.email}</strong>
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      mt: 0.2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="white"
                      fontWeight="bold"
                    >
                      2
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Haz clic en el enlace de restablecimiento
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      mt: 0.2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="white"
                      fontWeight="bold"
                    >
                      3
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Crea una nueva contraseña segura
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              ¿No recibiste el email? Revisa tu carpeta de spam o{" "}
              <Link
                component="button"
                onClick={handleResend}
                sx={{
                  textDecoration: "none",
                  color: "primary.main",
                  fontWeight: "bold",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                intenta de nuevo
              </Link>
            </Typography>

            <AuthButton
              component={RouterLink}
              to="/auth/login"
              variant="outlined"
              startIcon={<ArrowBack />}
            >
              Volver al inicio de sesión
            </AuthButton>
          </Box>
        </AuthFormContainer>
      </AuthCard>
    )
  }

  return (
    <AuthCard>
      <AuthHeader
        icon={<LockReset sx={{ fontSize: 30, color: "white" }} />}
        title="¿Olvidaste tu contraseña?"
        subtitle="No te preocupes, te ayudamos a recuperarla"
      />

      <AuthFormContainer>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña.
            </Typography>

            <AuthTextField
              label="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={!!errors.email}
              helperText={errors.email}
              startIcon={<Email color="action" fontSize="small" />}
              autoComplete="email"
            />

            <AuthButton
              type="submit"
              loading={isLoading}
              endIcon={<ArrowForward />}
            >
              {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
            </AuthButton>

            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                ¿Recordaste tu contraseña?{" "}
                <Link
                  component={RouterLink}
                  to="/auth/login"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                    fontWeight: "bold",
                    "&:hover": {
                      textDecoration: "underline",
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
