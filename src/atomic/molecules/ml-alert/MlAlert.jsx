import React from "react"
import { Alert } from "@mui/material"

const MlAlert = ({ errorMessage, type = "error" }) => {
  return <Alert severity={type}>{errorMessage}</Alert>
}

export default MlAlert
