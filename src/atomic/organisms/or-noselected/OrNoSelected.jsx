import React from "react"
import { Grid, Typography } from "@mui/material"
import { StarOutline } from "@mui/icons-material"
import imageMain from "../../../assets/imageclean.png"
import down from "../../../assets/arrowdown.png"

import AtBox from "../../atoms/at-box"

const OrNoSelected = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "calc(100vh - 110px)",
        borderRadius: 3,
      }}
    >
      <Grid
        item
        xs={12}
        sm={7}
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h1" sx={{ textAlign: "center" }}>
          ¡Bienvenido a NotesApp!
        </Typography>
        <Typography variant="h4" sx={{ textAlign: "center", mt: 5 }}>
          Tu espacio personal para tomar notas
        </Typography>
        <Typography variant="body1">
          Organiza tus ideas de manera eficiente
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={5}
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <img src={imageMain} alt="ImageMain" loading="lazy" />
        <AtBox
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            "@media (min-width: 900px)": {
              top: 100,
            },
          }}
        >
          <Typography variant="body" sx={{color:"gray"}}>
            Comienza agregando una Nota
          </Typography>
          <img
            src={down}
            width={200}
            style={{
              transform: "scaleX(-1)",
            }}
            alt="Arrow Down Icon"
            loading="lazy"
          />
        </AtBox>
      </Grid>
    </Grid>
  )
}

export default OrNoSelected
