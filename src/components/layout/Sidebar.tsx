import React from "react"
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Badge,
  useTheme,
} from "@mui/material"
import {
  Notes as NotesIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
} from "@mui/icons-material"
import { useNavigate, useLocation } from "react-router-dom"
import { NavigationItem } from "@/router/types/routes"

interface SidebarProps {
  onItemClick?: () => void
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Todas las notas",
    path: "/",
    icon: "notes",
  },
  {
    id: "note-new",
    label: "Nueva nota",
    path: "/notes/new",
    icon: "add",
  },
  {
    id: "favorites",
    label: "Favoritos",
    path: "/favorites",
    icon: "star",
  },
  {
    id: "search",
    label: "Búsqueda",
    path: "/search",
    icon: "search",
  },
  {
    id: "trash",
    label: "Papelera",
    path: "/trash",
    icon: "delete",
  },
]

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "notes":
      return <NotesIcon />
    case "search":
      return <SearchIcon />
    case "star":
      return <StarIcon />
    case "delete":
      return <DeleteIcon />
    case "settings":
      return <SettingsIcon />
    case "add":
      return <AddIcon />
    default:
      return <NotesIcon />
  }
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleItemClick = (path: string) => {
    navigate(path)
    onItemClick?.()
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo/Brand */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          NotesApp
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ pt: 1 }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(item.path)}
                  selected={isActive}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "inherit" : "text.secondary",
                      minWidth: 40,
                    }}
                  >
                    {getIcon(item.icon)}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                  {item.badge && (
                    <Badge
                      badgeContent={item.badge}
                      color="error"
                      sx={{ ml: 1 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Settings */}
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleItemClick("/settings")}
              sx={{
                mx: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon sx={{ color: "text.secondary", minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configuración" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  )
}
