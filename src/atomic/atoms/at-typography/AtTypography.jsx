import React from "react"
import Typography from "@mui/material/Typography"

const AtTypography = ({ variant = "body1", children, ...props }) => {
  return (
    <Typography variant={variant} {...props}>
      {children}
    </Typography>
  )
}

export default AtTypography
