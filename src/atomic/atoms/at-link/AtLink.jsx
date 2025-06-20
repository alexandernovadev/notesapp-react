import React from "react"
import { Link as RouterLink } from "react-router"
import Link from "@mui/material/Link"

const AtLink = ({ children, color = "inherit", to, ...props }) => {
  return (
    <Link component={RouterLink} color={color} to={to} {...props}>
      {children}
    </Link>
  )
}
export default AtLink
