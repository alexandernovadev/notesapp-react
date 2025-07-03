import React, { useState } from "react"
import {
  Box,
  InputBase,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  useTheme,
} from "@mui/material"
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const navigate = useNavigate()
  const { displayName, email, logout } = useAuth()

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/auth/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
    handleMenuClose()
  }

  const handleProfile = () => {
    navigate("/settings/profile")
    handleMenuClose()
  }

  const handleSettings = () => {
    navigate("/settings")
    handleMenuClose()
  }

  const open = Boolean(anchorEl)

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 2,
      }}
    >
      {/* Search Bar */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "background.default",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          px: 2,
          py: 1,
          flex: 1,
          maxWidth: 600,
          "&:hover": {
            borderColor: "primary.main",
          },
          "&:focus-within": {
            borderColor: "primary.main",
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
          },
        }}
      >
        <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
        <InputBase
          placeholder="Buscar notas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flex: 1,
            "& .MuiInputBase-input": {
              fontSize: "0.875rem",
            },
          }}
        />
      </Box>

      {/* User Menu */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            p: 1,
            border: "1px solid",
            borderColor: "divider",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: "primary.main",
              fontSize: "0.875rem",
            }}
          >
            {displayName
              ? displayName.charAt(0).toUpperCase()
              : email?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              borderRadius: 2,
            },
          }}
        >
          {/* User Info */}
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {displayName || "Usuario"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>

          <Divider />

          {/* Menu Items */}
          <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
            <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body2">Mi Perfil</Typography>
          </MenuItem>

          <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
            <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body2">Configuración</Typography>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={{ py: 1.5, color: "error.main" }}
          >
            <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body2">Cerrar Sesión</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}
