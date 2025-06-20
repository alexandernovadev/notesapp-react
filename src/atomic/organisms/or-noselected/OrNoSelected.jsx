import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Grid, Typography } from "@mui/material"
import imageMain from "../../../assets/imageclean.png"
import AtBox from "../../atoms/at-box"
import AtGrid from "../../atoms/at-grid"
import AtTypography from "../../atoms/at-typography"
import { setActiveNote } from "../../../store/journal/JournalSlice"
import { useNavigate } from "react-router-dom"

const OrNoSelected = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notes } = useSelector((state) => state.journal)

  const handleSelectNote = (note) => {
    dispatch(setActiveNote(note))
    navigate(`/addnote/${note.id}`)
  }

  if (!notes || notes.length === 0) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "calc(100vh - 110px)", borderRadius: 3 }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", mt: 5 }}>
          No hay tareas/Notas
        </Typography>
        <Typography variant="body1" sx={{ color: 'gray', mt: 2 }}>
          Comienza agregando una nueva nota
        </Typography>
        <img src={imageMain} alt="ImageMain" loading="lazy" style={{ marginTop: 32, maxWidth: 300 }} />
      </Grid>
    )
  }

  return (
    <AtGrid container spacing={3} sx={{ p: 2, minHeight: "calc(100vh - 110px)" }}>
      {notes.map((note) => {
        const imgSrc = note.imageUrls && note.imageUrls.length > 0 ? note.imageUrls[0] : imageMain
        return (
          <AtGrid item xs={12} sm={6} md={4} key={note.id}>
            <AtBox
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
                cursor: "pointer",
                backgroundColor: "primary.light",
                transition: "box-shadow 0.2s",
                ':hover': { boxShadow: 6, backgroundColor: 'primary.main', color: 'white' },
              }}
              onClick={() => handleSelectNote(note)}
            >
              <img
                src={imgSrc}
                alt={note.title}
                style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, marginRight: 16 }}
                loading="lazy"
              />
              <div style={{ flex: 1 }}>
                <AtTypography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {note.title || 'Sin título'}
                </AtTypography>
                <AtTypography variant="body2" sx={{ color: 'gray' }}>
                  {note.body ? (note.body.length > 80 ? note.body.slice(0, 80) + '...' : note.body) : 'Sin descripción'}
                </AtTypography>
              </div>
            </AtBox>
          </AtGrid>
        )
      })}
    </AtGrid>
  )
}

export default OrNoSelected
