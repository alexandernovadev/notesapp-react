import React from "react"
import { Box, Divider, Typography } from "@mui/material"

interface AuthDividerProps {
  text?: string
}

export const AuthDivider: React.FC<AuthDividerProps> = ({
  text = "o continúa con",
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 1.5 }}>
      <Divider sx={{ flex: 1 }} />
      <Typography variant="caption" color="text.secondary">
        {text}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Box>
  )
}
