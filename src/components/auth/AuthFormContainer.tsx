import React from "react"
import { Box } from "@mui/material"

interface AuthFormContainerProps {
  children: React.ReactNode
}

export const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  children,
}) => {
  return <Box sx={{ padding: 2.5 }}>{children}</Box>
}
