import React from "react"
import TextField from "@mui/material/TextField"

const AtTextField = ({ label, variant='outlined', ...props }) => {
  return (
    <TextField
      label={label}
      variant={variant }
      fullWidth
      {...props}
    />
  )
}

export default AtTextField
