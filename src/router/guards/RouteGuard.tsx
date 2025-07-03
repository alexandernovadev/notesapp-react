import React, { Suspense } from "react"
import { Box, CircularProgress, Typography, Alert, Button } from "@mui/material"
import { ErrorBoundary } from "react-error-boundary"

interface RouteGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

// Error fallback component
const ErrorFallback: React.FC<{
  error: Error
  resetErrorBoundary: () => void
}> = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={3}
      p={3}
    >
      <Alert severity="error" sx={{ maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          Algo salió mal
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {error.message || "Ocurrió un error inesperado"}
        </Typography>
        <Button variant="contained" onClick={resetErrorBoundary} sx={{ mt: 2 }}>
          Intentar de nuevo
        </Button>
      </Alert>
    </Box>
  )
}

// Loading fallback component
const LoadingFallback: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" color="text.secondary">
        Cargando...
      </Typography>
    </Box>
  )
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  fallback = <LoadingFallback />,
}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}
