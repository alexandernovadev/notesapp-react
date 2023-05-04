import React from "react"

import Button from "@mui/material/Button"

const AtButton = ({
  children,
  variant = "contained",
  color = "primary",
  onClick,
  ...props
}) => {
  return (
    <Button variant={variant} color={color} onClick={onClick} {...props}>
      {children}
    </Button>
  )
}

export default AtButton
