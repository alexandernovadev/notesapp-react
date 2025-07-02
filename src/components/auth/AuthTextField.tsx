import React from 'react'
import { TextField, InputAdornment, useTheme } from '@mui/material'

interface AuthTextFieldProps {
  label: string
  type?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  helperText?: string | undefined
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  fullWidth?: boolean
}

export const AuthTextField: React.FC<AuthTextFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error = false,
  helperText,
  startIcon,
  endIcon,
  fullWidth = true,
}) => {
  const theme = useTheme()

  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      size="medium"
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ) : undefined,
        endAdornment: endIcon ? (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ) : undefined,
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
} 