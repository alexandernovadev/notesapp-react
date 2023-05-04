import React from "react"
import Grid from "@mui/material/Grid"

const AtGrid = ({
  container,
  item,
  xs,
  sm,
  md,
  lg,
  xl,
  children,
  ...props
}) => {
  return (
    <Grid
      container={container}
      item={item}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      {...props}
    >
      {children}
    </Grid>
  )
}

export default AtGrid
