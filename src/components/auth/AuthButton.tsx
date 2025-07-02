import React from 'react'
import { Button, useTheme } from '@mui/material'

interface AuthButtonProps {
  children: React.ReactNode
  variant?: 'contained' | 'outlined'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  variant = 'contained',
  fullWidth = true,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  startIcon,
  endIcon,
}) => {
  const theme = useTheme()

  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: 1.5,
      py: 1.2,
      fontSize: '1rem',
      fontWeight: 'bold',
      textTransform: 'none',
      transition: 'all 0.3s ease',
    }

    if (variant === 'contained') {
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        '&:hover': {
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
          transform: 'translateY(-1px)',
          boxShadow: theme.shadows[6],
        },
      }
    }

    return {
      ...baseStyles,
      borderColor: theme.palette.divider,
      color: theme.palette.text.primary,
      '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main + '08',
        transform: 'translateY(-1px)',
      },
    }
  }

  return (
    <Button
      variant={variant}
      size="large"
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      startIcon={startIcon}
      endIcon={loading ? null : endIcon}
      sx={getButtonStyles()}
    >
      {children}
    </Button>
  )
} 