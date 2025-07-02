import React from "react"
import { Box, Typography, useTheme } from "@mui/material"
import { Fade } from "@mui/material"

interface AuthHeaderProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  iconColor?: "primary" | "success"
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  icon,
  title,
  subtitle,
  iconColor = "primary",
}) => {
  const theme = useTheme()

  const getGradient = () => {
    if (iconColor === "success") {
      return `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`
    }
    return `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
  }

  const getBackgroundGradient = () => {
    if (iconColor === "success") {
      return `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.primary.main}15)`
    }
    return `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`
  }

  return (
    <Box
      sx={{
        background: getBackgroundGradient(),
        padding: 3,
        textAlign: "center",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Fade in={true} timeout={1200}>
        <Box>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: getGradient(),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              boxShadow: theme.shadows[6],
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Fade>
    </Box>
  )
}
