import React from "react"
import { IconButton } from "@mui/material"

const AtIconButton = ({ children, ...props }) => {
  return <IconButton {...props}>{children}</IconButton>
}

export default AtIconButton
