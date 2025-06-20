import React from "react"

import { useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

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

import { useForm } from "../../../hooks/useForm"
// import { ImageGallery } from "../components"

import {
  startDeletingNote,
  startSaveNote,
  startUploadingFiles,
} from "../../../store/journal/thunks"
import {
  setActiveNote,
  setActiveNote as clearActiveNote,
} from "../../../store/journal/JournalSlice"

const OrNoteView = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    active: note,
    messageSaved,
    isSaving,
  } = useSelector((state) => state.journal)

  // Valores por defecto para evitar undefined
  const safeNote = {
    title: note?.title ?? "",
    body: note?.body ?? "",
    date: note?.date ?? Date.now(),
    imageUrls: note?.imageUrls ?? [],
    id: note?.id ?? undefined,
  }
  const { body, title, date, onInputChange, formState } = useForm(safeNote)

  const dateString = useMemo(() => {
    const newDate = new Date(date)
    return newDate.toUTCString()
  }, [date])

  const fileInputRef = useRef()

  useEffect(() => {
    dispatch(setActiveNote(formState))
  }, [formState])

  useEffect(() => {
    if (messageSaved.length > 0) {
      Swal.fire("Nota actualizada", messageSaved, "success").then(() => {
        dispatch(clearActiveNote(null))
        navigate("/")
      })
    }
  }, [messageSaved])

  const onSaveNote = () => {
    dispatch(startSaveNote())
  }

  const onFileInputChange = ({ target }) => {
    if (target.files === 0) return
    dispatch(startUploadingFiles(target.files))
  }

  const onDelete = () => {
    dispatch(startDeletingNote())
  }

  return (
    <TmDashlayout>
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

        {/* <ImageGallery images={note.imageUrls} /> */}
      </AtGrid>
    </TmDashlayout>
  )
}

export default OrNoteView
