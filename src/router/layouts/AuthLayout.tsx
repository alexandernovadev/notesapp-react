import React from 'react'
import { 
  Box, 
  Container, 
  Paper, 
  Typography,
  CssBaseline
} from '@mui/material'
import { Outlet } from 'react-router-dom'

export const AuthLayout: React.FC = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <CssBaseline />
      
      <Container 
        component="main" 
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            backgroundColor: 'background.paper',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              NotesApp
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tu espacio personal para ideas y notas
            </Typography>
          </Box>
          
          <Outlet />
        </Paper>
      </Container>
    </Box>
  )
} 