import React from "react"
import { Avatar } from "@mui/material"

const AtAvatar = ({ src, alt, ...props }) => {
  return <Avatar src={src} alt={alt} aria-label={alt} {...props} />
}

export default AtAvatar
