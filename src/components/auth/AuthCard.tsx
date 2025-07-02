import React from 'react'
import { Box, Paper, useTheme } from '@mui/material'
import { Slide } from '@mui/material'

interface AuthCardProps {
  children: React.ReactNode
  maxWidth?: number
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, maxWidth = 400 }) => {
  const theme = useTheme()

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
            maxWidth,
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
          {children}
        </Paper>
      </Slide>
    </Box>
  )
} 