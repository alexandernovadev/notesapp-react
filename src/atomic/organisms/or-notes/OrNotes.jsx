import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Grid, Typography, CircularProgress } from "@mui/material"
import imageMain from "../../../assets/imageclean.png"
import AtBox from "../../atoms/at-box"
import AtGrid from "../../atoms/at-grid"
import AtTypography from "../../atoms/at-typography"
import { useNavigate } from "react-router"
import { setActiveNote } from "../../../store/journal/JournalSlice"

const OrNotes = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { notes, isLoading } = useSelector((state) => state.journal)

  const handleSelectNote = (note) => {
    dispatch(setActiveNote(note))
    navigate(`/addnote/${note.id}`)
  }

  if (isLoading) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "calc(100vh - 110px)", borderRadius: 3 }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, color: 'gray' }}>Cargando notas...</Typography>
      </Grid>
    )
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
    <AtBox sx={{ maxWidth: 1024, mx: 'auto', width: '100%' }}>
      <AtGrid container spacing={2} sx={{ p: 1, py: 0 }}>
        {notes.map((note) => {
          const imgSrc = note.imageUrls && note.imageUrls.length > 0 ? note.imageUrls[0] : imageMain
          return (
            <AtGrid item xs={12} sm={6} md={4} lg={3} key={note.id} sx={{ display: 'flex' }}>
              <AtBox
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  boxShadow: 2,
                  cursor: "pointer",
                  backgroundColor: "primary.light",
                  minHeight: 110,
                  height: 130,
                  width: '100%',
                  minWidth: 0,
                  transition: "box-shadow 0.25s, transform 0.18s",
                  ':hover': {
                    boxShadow: 10,
                    backgroundColor: 'primary.light',
                    color: 'inherit',
                    transform: 'translateY(-4px) scale(1.03)',
                  },
                }}
                onClick={() => handleSelectNote(note)}
              >
                <img
                  src={imgSrc}
                  alt={note.title}
                  style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, marginRight: 16 }}
                  loading="lazy"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <AtTypography variant="h6" sx={{ mb: 1, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {note.title || 'Sin título'}
                  </AtTypography>
                  <AtTypography variant="body2" sx={{ color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', minWidth: 0 }}>
                    {note.body ? note.body : 'Sin descripción'}
                  </AtTypography>
                </div>
              </AtBox>
            </AtGrid>
          )
        })}
      </AtGrid>
    </AtBox>
  )
}

export default OrNotes
