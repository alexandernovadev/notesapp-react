import React, { useEffect, useMemo, useRef, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"

import {
  DeleteOutline,
  SaveOutlined,
  UploadOutlined,
} from "@mui/icons-material"
import {
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material"
import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.css"

import AtGrid from "../../atoms/at-grid"
import ImageGallery from "../../molecules/image-gallery/ImageGallery"

import { useForm } from "../../../hooks/useForm"

import {
  startDeletingNote,
  startSaveNote,
  startUploadingFiles,
} from "../../../store/journal/thunks"

const OrNoteView = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    active: note,
    messageSaved,
    isSaving,
  } = useSelector((state) => state.journal)

  // Memoizar valores seguros para la nota
  const safeNote = useMemo(
    () => ({
      title: note?.title ?? "",
      body: note?.body ?? "",
      date: note?.date ?? Date.now(),
      imageUrls: note?.imageUrls ?? [],
      id: note?.id ?? undefined,
    }),
    [note]
  )

  const { body, title, date, onInputChange, formState } = useForm(safeNote)

  const dateString = useMemo(() => {
    const newDate = new Date(date)
    return newDate.toUTCString()
  }, [date])

  const fileInputRef = useRef()

  // Efecto para mostrar mensaje de guardado
  useEffect(() => {
    if (messageSaved.length > 0) {
      Swal.fire("Nota actualizada", messageSaved, "success").then(() => {
        navigate("/")
      })
    }
  }, [messageSaved, navigate])

  // Callbacks para evitar recreación innecesaria
  const onSaveNote = useCallback(() => {
    dispatch(startSaveNote())
  }, [dispatch])

  const onFileInputChange = useCallback(
    ({ target }) => {
      if (!target.files || target.files.length === 0) return
      dispatch(startUploadingFiles(target.files))
    },
    [dispatch]
  )

  const onDelete = useCallback(() => {
    dispatch(startDeletingNote())
  }, [dispatch])

  // Render condicional en variable
  const noNoteSelected = !note || !note.id

  return (
    <>
      {noNoteSelected ? (
        <Typography variant="h5" sx={{ mt: 5, textAlign: "center" }}>
          Selecciona o crea una nota
        </Typography>
      ) : (
        <AtGrid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
          className="animate__animated animate__fadeIn animate__faster"
        >
          <AtGrid item>
            <Typography fontSize={21} fontWeight="light">
              {dateString}
            </Typography>
          </AtGrid>

          <AtGrid item>
            {isSaving && (
              <Box sx={{ width: "100%" }}>
                <LinearProgress color="secondary" />
              </Box>
            )}

            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={onFileInputChange}
              style={{ display: "none" }}
            />

            <IconButton
              color="primary"
              disabled={isSaving}
              onClick={() => fileInputRef.current.click()}
            >
              <UploadOutlined />
            </IconButton>

            <Button
              disabled={isSaving}
              onClick={onSaveNote}
              color="primary"
              variant="contained"
              sx={{}}
            >
              <SaveOutlined sx={{ fontSize: 30, mr: 1 }} />
              Guardar
            </Button>
          </AtGrid>

          <AtGrid container sx={{ my: 3 }}>
            <TextField
              type="text"
              fullWidth
              placeholder="Ingrese un título"
              label="Título"
              sx={{ border: "none", mb: 1 }}
              name="title"
              value={title}
              onChange={onInputChange}
            />

            <TextField
              type="text"
              fullWidth
              multiline
              placeholder="¿Qué sucedió en el día de hoy?"
              minRows={5}
              name="body"
              value={body}
              onChange={onInputChange}
            />
          </AtGrid>

          <AtGrid container justifyContent="end">
            <Button onClick={onDelete} sx={{ mt: 2 }} color="error">
              <DeleteOutline />
              Borrar
            </Button>
          </AtGrid>

          <ImageGallery images={note.imageUrls} />
        </AtGrid>
      )}
    </>
  )
}

export default OrNoteView
