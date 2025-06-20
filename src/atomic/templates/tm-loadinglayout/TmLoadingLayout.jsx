import React from "react"

import { CircularProgress } from "@mui/material"
import AtGrid from "../../atoms/at-grid"

const TmLoadingLayout = () => {
  return (
    <AtGrid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", padding: 4 }}
    >
      <AtGrid container direction="row" justifyContent="center">
        <CircularProgress color="warning" />
      </AtGrid>
    </AtGrid>
  )
}

export default TmLoadingLayout
