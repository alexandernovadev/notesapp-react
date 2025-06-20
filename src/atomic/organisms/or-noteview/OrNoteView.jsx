import React, { useEffect, useMemo, useRef, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router"

import {
  DeleteOutline,
  SaveOutlined,
  UploadOutlined,
  EditOutlined,
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
  startNewNote,
} from "../../../store/journal/thunks"
import { setActiveNote } from "../../../store/journal/JournalSlice"

import TmLoadingLayout from "../../templates/tm-loadinglayout/TmLoadingLayout"

const OrNoteView = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id: noteIdParam } = useParams()
  const {
    active: note,
    messageSaved,
    isSaving,
    notes,
    isLoading,
  } = useSelector((state) => state.journal)

  // Estado para error de nota no encontrada
  const [notFound, setNotFound] = useState(false)

  // Buscar y setear nota activa si hay id en la URL
  useEffect(() => {
    if (isLoading) return;
    if (noteIdParam) {
      // Si la nota activa no coincide con el id de la URL
      if (!note || note.id !== noteIdParam) {
        const found = notes?.find((n) => n.id === noteIdParam)
        if (found) {
          dispatch(setActiveNote(found))
          setNotFound(false)
        } else {
          setNotFound(true)
        }
      } else {
        setNotFound(false)
      }
    } else {
      setNotFound(false)
    }
  }, [noteIdParam, notes, note, dispatch, isLoading])

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

  // Nuevo handler para sincronizar con el store
  const onInputChangeAndSync = (e) => {
    onInputChange(e)
    dispatch(setActiveNote({
      ...note,
      [e.target.name]: e.target.value,
    }))
  }

  const dateString = useMemo(() => {
    const newDate = new Date(date)
    return newDate.toUTCString()
  }, [date])

  const fileInputRef = useRef()

  // Efecto para mostrar mensaje de guardado
  useEffect(() => {
    if (messageSaved.length > 0) {
      if (note && note.id && note.title && note.body) {
        Swal.fire("Nota actualizada", messageSaved, "success").then(() => {
          navigate("/")
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Nota agregada exitosamente',
          timer: 1800,
          showConfirmButton: false,
        }).then(() => {
          navigate("/")
        })
      }
    }
  }, [messageSaved, navigate])

  // Callbacks para evitar recreación innecesaria
  const onSaveNote = useCallback(() => {
    dispatch(startSaveNote())
  }, [dispatch])

  const onFileInputChange = useCallback(
    ({ target }) => {
      if (!target.files || target.files.length === 0) return
      // Validación de archivos
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"]
      const maxSize = 5 * 1024 * 1024 // 5MB
      const invalids = Array.from(target.files).filter(
        (file) => !validTypes.includes(file.type) || file.size > maxSize
      )
      if (invalids.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo no válido',
          text: 'Solo se permiten imágenes (jpg, png, gif, webp) y máximo 5MB.',
        })
        return
      }
      dispatch(startUploadingFiles(target.files))
    },
    [dispatch]
  )

  const onDelete = useCallback(async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro de borrar esta nota?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    })
    if (result.isConfirmed) {
      await dispatch(startDeletingNote())
      navigate("/")
    }
  }, [dispatch, navigate])

  // Acción para crear una nueva nota
  const onAddNewNote = useCallback(() => {
    dispatch(startNewNote())
    navigate("/addnote")
  }, [dispatch, navigate])

  // Render condicional en variable
  const noNoteSelected = (!note || !note.id) && !notFound

  return (
    <>
      {isLoading ? (
        <TmLoadingLayout />
      ) : notFound ? (
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography variant="h4" color="error" gutterBottom>
            Oops, no existe ninguna nota con ese ID
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Puedes crear una nueva nota o volver al inicio.
          </Typography>
          <Button variant="contained" color="primary" onClick={onAddNewNote} sx={{ mr: 2 }}>Agregar nueva nota</Button>
          <Button variant="outlined" color="primary" onClick={() => navigate("/")}>Volver al inicio</Button>
        </Box>
      ) : noNoteSelected ? (
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
              color={note && note.id ? "success" : "primary"}
              variant="contained"
              sx={{}}
            >
              {note && note.id ? (
                <>
                  <EditOutlined sx={{ fontSize: 30, mr: 1 }} />
                  Editar
                </>
              ) : (
                <>
                  <SaveOutlined sx={{ fontSize: 30, mr: 1 }} />
                  Guardar
                </>
              )}
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
              onChange={onInputChangeAndSync}
            />

            <TextField
              type="text"
              fullWidth
              multiline
              placeholder="¿Qué sucedió en el día de hoy?"
              minRows={5}
              name="body"
              value={body}
              onChange={onInputChangeAndSync}
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
