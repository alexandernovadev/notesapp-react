import React from "react"
import { Box } from "@mui/material"

const AtBox = ({ children, ...props }) => {
  return <Box {...props}>{children}</Box>
}

export default AtBox
