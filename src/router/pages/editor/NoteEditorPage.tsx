import React from "react"
import {
  Box,
  TextField,
  Typography,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Switch,
  Stack,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  LinearProgress,
} from "@mui/material"
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material"
import { useNavigate, useParams } from "react-router-dom"
import { NoteEditor } from "@/components/editor"
import { useNoteEditor } from "@/hooks/useNoteEditor"
import { ImageModal } from "@/components/ImageModal"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import TagIcon from "@mui/icons-material/Tag"
import PaletteIcon from "@mui/icons-material/Palette"
import CategoryIcon from "@mui/icons-material/Category"
import ImageIcon from "@mui/icons-material/Image"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import {
  CATEGORY_OPTIONS,
  TAG_OPTIONS,
  COLOR_PALETTE,
} from "@/utils/noteOptions"
import { fileUpload } from "@/helpers/fileUpload"
import { useJournal } from "@/hooks/useJournal"

export const NoteEditorPage: React.FC = React.memo(() => {
  const navigate = useNavigate()
  const { noteId } = useParams<{ noteId: string }>()

  const {
    content,
    title,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    messageSaved,
    setContent,
    setTitle,
    save,
    active,
    setHasUnsavedChanges,
  } = useNoteEditor({
    noteId: noteId || undefined,
  })

  // console.log('🎯 DESPUÉS DE useNoteEditor - active:', active?.id, 'title:', title, 'content:', content?.substring(0, 50))

  // INICIALIZAR SIEMPRE CON VALORES POR DEFECTO - el useEffect ajustará según active
  const [category, setCategoryState] = React.useState("Personal")
  const [tags, setTagsState] = React.useState<string[]>([])
  const [color, setColorState] = React.useState("#f8fafc")
  const [priority, setPriorityState] = React.useState<
    "low" | "medium" | "high"
  >("medium")
  const [images, setImages] = React.useState<string[]>([])
  const [pendingFiles, setPendingFiles] = React.useState<File[]>([])
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]) // URLs temporales para preview

  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false)
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  const [isUploadingImages, setIsUploadingImages] = React.useState(false)
  const [isSavingNote, setIsSavingNote] = React.useState(false)
  const [imageUploadProgress, setImageUploadProgress] =
    React.useState<number>(0)
  const [imageUploadError, setImageUploadError] = React.useState<string | null>(
    null
  )

  const { setActiveNote, createNote } = useJournal()

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("¿Deseas salir sin guardar los cambios?")
      if (!confirmed) return
    }
    navigate("/")
  }

  const handleSave = async () => {
    setImageUploadError(null)
    setIsUploadingImages(false)
    setIsSavingNote(false)
    try {
      // Inicializar con URLs reales (no blob URLs)
      let finalImageUrls = images.filter((url) => !url.startsWith("blob:"))

      // Subir imágenes a Cloudinary si hay archivos pendientes
      if (pendingFiles.length > 0) {
        setIsUploadingImages(true)
        setImageUploadProgress(0)
        const total = pendingFiles.length
        let uploadedUrls: string[] = []
        for (let i = 0; i < total; i++) {
          const file = pendingFiles[i]
          if (!file) continue
          try {
            const url = await fileUpload(file)
            uploadedUrls.push(url)
            setImageUploadProgress(Math.round(((i + 1) / total) * 100))
          } catch (err: any) {
            setImageUploadError(err.message || "Error al subir imagen")
            setIsUploadingImages(false)
            return
          }
        }

        // SOLO usar URLs reales (filtrar blob URLs) + URLs de Cloudinary
        const realImageUrls = images.filter((url) => !url.startsWith("blob:"))
        finalImageUrls = [...realImageUrls, ...uploadedUrls]
        setImages(finalImageUrls)
        setPendingFiles([])
        setPreviewUrls([]) // Limpiar URLs temporales
        setIsUploadingImages(false)
      }

      setIsSavingNote(true)

      if (noteId && active) {
        // EDITAR NOTA EXISTENTE - actualizar nota activa con todos los campos
        const noteToSave = {
          ...active,
          title,
          body: content,
          imageUrls: finalImageUrls,
          category,
          tags,
          color,
          priority,
        }

        console.log("✏️ EDITANDO NOTA EXISTENTE:", noteToSave.id)
        setActiveNote(noteToSave)
        await save()
      } else {
        // CREAR NUEVA NOTA - usar createNote directamente con los datos
        console.log("✨ CREANDO NUEVA NOTA")
        await createNote({
          title,
          body: content,
          imageUrls: finalImageUrls,
          category,
          tags,
          color,
          priority,
          isFavorite: false,
          isPinned: false,
        })
      }

      setIsSavingNote(false)
    } catch (error) {
      setIsSavingNote(false)
      setImageUploadError("Error al guardar la nota")
      console.error("Error saving note:", error)
    }
  }

  // Debug: log content and title when they change (DEBOUNCED)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log("NoteEditorPage debug:", {
        noteId,
        title,
        content: content?.substring(0, 50),
      })
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [noteId, title, content])

  // Estado para mostrar/ocultar el Alert de guardado
  const [showAlert, setShowAlert] = React.useState(false)
  React.useEffect(() => {
    if (messageSaved) setShowAlert(true)
  }, [messageSaved])

  // Tabs
  const [tab, setTab] = React.useState(0)
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setTab(newValue)

  // Handler para imágenes (OPTIMIZADOS)
  const handleImageUpload = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return
      const fileArray = Array.from(files)
      setPendingFiles((prev) => [...prev, ...fileArray])

      // Crear URLs temporales para preview (NO agregar a images)
      const urls = fileArray.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...urls])
      setHasUnsavedChanges(true)
    },
    [setHasUnsavedChanges]
  )

  // Función para obtener todas las imágenes (reales + preview) - MEMOIZADA
  const getAllImages = React.useMemo(() => {
    return [...images, ...previewUrls]
  }, [images, previewUrls])

  const handleRemoveImage = React.useCallback(
    (url: string) => {
      if (url.startsWith("blob:")) {
        // Es una URL temporal, remover de previewUrls y pendingFiles
        setPreviewUrls((prev) => prev.filter((img) => img !== url))
        setPendingFiles((prev) =>
          prev.filter((file) => URL.createObjectURL(file) !== url)
        )
      } else {
        // Es una URL real, remover de images
        setImages((prev) => prev.filter((img) => img !== url))
      }
      setHasUnsavedChanges(true)
    },
    [setHasUnsavedChanges]
  )

  // Drag and drop handlers (OPTIMIZADOS)
  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const files = Array.from(e.dataTransfer.files)
      const imageFiles = files.filter((file) => file.type.startsWith("image/"))

      if (imageFiles.length > 0) {
        setPendingFiles((prev) => [...prev, ...imageFiles])
        const urls = imageFiles.map((file) => URL.createObjectURL(file))
        setPreviewUrls((prev) => [...prev, ...urls])
        setHasUnsavedChanges(true)
      }
    },
    [setHasUnsavedChanges]
  )

  // Modal handlers (OPTIMIZADOS)
  const handleImageClick = React.useCallback((index: number) => {
    setCurrentImageIndex(index)
    setModalOpen(true)
  }, [])

  const handleModalClose = React.useCallback(() => {
    setModalOpen(false)
  }, [])

  const handleImageChange = React.useCallback((index: number) => {
    setCurrentImageIndex(index)
  }, [])

  // Handlers que marcan cambios pendientes (OPTIMIZADOS)
  const setCategory = React.useCallback(
    (val: string) => {
      setCategoryState(val)
      setHasUnsavedChanges(true)
    },
    [setHasUnsavedChanges]
  )

  const setTags = React.useCallback(
    (val: string[]) => {
      setTagsState(val)
      setHasUnsavedChanges(true)
    },
    [setHasUnsavedChanges]
  )

  const setColor = React.useCallback(
    (val: string) => {
      setColorState(val)
      setHasUnsavedChanges(true)
    },
    [setHasUnsavedChanges]
  )

  const setPriority = React.useCallback(
    (val: "low" | "medium" | "high") => {
      setPriorityState(val)
      setHasUnsavedChanges(true)
    },
    [setHasUnsavedChanges]
  )

  React.useEffect(() => {
    // SOLO ejecutar cuando cambia el ID de la nota activa o cuando noteId cambia
    const activeId = active?.id || null
    // console.log('🔍 NoteEditorPage useEffect - noteId:', noteId, 'activeId:', activeId)

    if (active && noteId === activeId) {
      // CARGAR DATOS DE NOTA EXISTENTE
      console.log("📝 CARGANDO DATOS DE NOTA EXISTENTE:", activeId)
      setCategoryState(active.category || "Personal")
      setTagsState(active.tags || [])
      setColorState(active.color || "#f8fafc")
      setPriorityState(active.priority || "medium")
      setImages(active.imageUrls || [])
      // Limpiar URLs temporales al cargar una nota existente
      setPreviewUrls([])
      setPendingFiles([])
    } else if (!noteId && active) {
      // RESETEAR ESTADO PARA NUEVA NOTA
      console.log("🔄 LIMPIANDO ESTADO PARA NUEVA NOTA")
      setCategoryState("Personal")
      setTagsState([])
      setColorState("#f8fafc")
      setPriorityState("medium")
      setImages([])
      setPreviewUrls([])
      setPendingFiles([])
    }
  }, [active?.id, noteId]) // Solo depende de active.id, no de todo el objeto active

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Mostrar loading si hay noteId pero el contenido está vacío y no se está guardando */}
      {noteId && !content && !isSaving ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Cargando nota...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 0.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={handleBack} size="small">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" component="h1">
                {noteId ? "Editar Nota" : "Nueva Nota"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Status indicators */}
              {isSaving && (
                <Chip
                  label="Guardando..."
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}

              {lastSaved && !isSaving && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`Guardado ${formatDistanceToNow(lastSaved, {
                    addSuffix: true,
                    locale: es,
                  })}`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}

              {hasUnsavedChanges && (
                <Chip
                  label="Cambios sin guardar"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              )}

              {/* Save button */}
              {isSaving || !hasUnsavedChanges ? (
                <Tooltip title="Sin cambios para guardar" arrow>
                  <span>
                    <IconButton onClick={handleSave} disabled color="primary">
                      <SaveIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="Guardar (Ctrl+S)" arrow>
                  <IconButton onClick={handleSave} color="primary">
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Tabs */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: "background.paper",
              px: 2,
            }}
          >
            <Tabs value={tab} onChange={handleTabChange} aria-label="tabs nota">
              <Tab label="Básico" />
              <Tab label="Detalle" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              p: 2,
              gap: 2,
            }}
          >
            {/* Panel Básico */}
            {tab === 0 && (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  placeholder="Título de la nota..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.5rem",
                      fontWeight: 600,
                    },
                  }}
                />
                {/* Pin/Favorito */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Tooltip title="Favorito">
                    <IconButton
                      color={active?.isFavorite ? "primary" : "default"}
                    >
                      <StarIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Fijar nota">
                    <Switch
                      checked={active?.isPinned || false}
                      color="primary"
                    />
                  </Tooltip>
                </Box>
                {/* Editor */}
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <NoteEditor
                    content={content}
                    onUpdate={setContent}
                    placeholder="Comienza a escribir tu nota..."
                    autoFocus={!noteId}
                  />
                </Box>
              </Stack>
            )}
            {/* Panel Detalle */}
            {tab === 1 && (
              <Box>
                <Grid container spacing={3}>
                  {/* Categoría */}
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      <CategoryIcon fontSize="small" /> Categoría
                    </Typography>
                    <Autocomplete
                      freeSolo
                      options={CATEGORY_OPTIONS}
                      value={category}
                      onChange={(_, newValue) => setCategory(newValue || "")}
                      renderInput={(params) => {
                        const { size, InputLabelProps, ...rest } = params
                        return (
                          <TextField
                            {...rest}
                            InputLabelProps={{
                              ...InputLabelProps,
                              className: InputLabelProps?.className ?? "",
                              style: InputLabelProps?.style ?? {},
                            }}
                            placeholder="Ej: Personal, Trabajo..."
                            fullWidth
                            variant="standard"
                            sx={{
                              backgroundColor: "background.default",
                              borderRadius: 1,
                              px: 1,
                            }}
                          />
                        )
                      }}
                    />
                  </Grid>
                  {/* Tags */}
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "secondary.main",
                        fontWeight: 700,
                      }}
                    >
                      <TagIcon fontSize="small" /> Tags
                    </Typography>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={TAG_OPTIONS}
                      value={tags}
                      onChange={(_, newValue) => setTags(newValue as string[])}
                      renderTags={(value: string[], getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            icon={<TagIcon />}
                            variant="filled"
                            color="secondary"
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                            sx={{
                              m: 0.5,
                              fontWeight: 500,
                              boxShadow: 1,
                              transition: "all 0.2s",
                              "&:hover": {
                                boxShadow: 3,
                                transform: "scale(1.08)",
                              },
                            }}
                          />
                        ))
                      }
                      renderInput={(params) => {
                        const { size, InputLabelProps, ...rest } = params
                        return (
                          <TextField
                            {...rest}
                            InputLabelProps={{
                              ...InputLabelProps,
                              className: InputLabelProps?.className ?? "",
                              style: InputLabelProps?.style ?? {},
                            }}
                            placeholder="Agrega tags..."
                            fullWidth
                            variant="standard"
                            sx={{
                              backgroundColor: "background.default",
                              borderRadius: 1,
                              px: 1,
                            }}
                          />
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  {/* Color y Prioridad */}
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "warning.main",
                        fontWeight: 700,
                      }}
                    >
                      <PaletteIcon fontSize="small" /> Color
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      {COLOR_PALETTE.map((c) => (
                        <IconButton
                          key={c}
                          onClick={() => setColor(c)}
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border:
                              color === c ? "2.5px solid" : "1px solid #eee",
                            borderColor: color === c ? "primary.main" : "#eee",
                            background: c,
                            transition: "all 0.2s",
                            boxShadow: color === c ? 3 : 0,
                            transform: color === c ? "scale(1.12)" : "scale(1)",
                          }}
                        />
                      ))}
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          border: "1.5px dashed #bbb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          ml: 1,
                        }}
                      >
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          style={{
                            width: 28,
                            height: 28,
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          border: "1px solid #ddd",
                          background: color,
                          ml: 1,
                          transition: "all 0.2s",
                          boxShadow: 2,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "error.main",
                        fontWeight: 700,
                      }}
                    >
                      <AccessTimeIcon fontSize="small" /> Prioridad
                    </Typography>
                    <RadioGroup
                      row
                      value={priority}
                      onChange={(e) =>
                        setPriority(e.target.value as "low" | "medium" | "high")
                      }
                    >
                      <Tooltip title="Alta prioridad: Urgente o importante">
                        <FormControlLabel
                          value="high"
                          control={
                            <Radio
                              sx={{
                                color: "error.main",
                                "&.Mui-checked": { color: "error.main" },
                              }}
                            />
                          }
                          label={
                            <Chip
                              icon={<AccessTimeIcon />}
                              label="Alta"
                              sx={{
                                bgcolor: "error.main",
                                color: "white",
                                fontWeight: 700,
                                px: 2,
                                fontSize: 16,
                              }}
                            />
                          }
                        />
                      </Tooltip>
                      <Tooltip title="Prioridad media: Importante pero no urgente">
                        <FormControlLabel
                          value="medium"
                          control={
                            <Radio
                              sx={{
                                color: "warning.main",
                                "&.Mui-checked": { color: "warning.main" },
                              }}
                            />
                          }
                          label={
                            <Chip
                              icon={<AccessTimeIcon />}
                              label="Media"
                              sx={{
                                bgcolor: "warning.main",
                                color: "white",
                                fontWeight: 700,
                                px: 2,
                                fontSize: 16,
                              }}
                            />
                          }
                        />
                      </Tooltip>
                      <Tooltip title="Prioridad baja: Opcional o sin apuro">
                        <FormControlLabel
                          value="low"
                          control={
                            <Radio
                              sx={{
                                color: "success.main",
                                "&.Mui-checked": { color: "success.main" },
                              }}
                            />
                          }
                          label={
                            <Chip
                              icon={<AccessTimeIcon />}
                              label="Baja"
                              sx={{
                                bgcolor: "success.main",
                                color: "white",
                                fontWeight: 700,
                                px: 2,
                                fontSize: 16,
                              }}
                            />
                          }
                        />
                      </Tooltip>
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  {/* Imágenes */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "info.main",
                        fontWeight: 700,
                      }}
                    >
                      <ImageIcon fontSize="small" /> Imágenes
                    </Typography>

                    {/* Estado de subida de imágenes */}
                    {isUploadingImages && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="info.main"
                          sx={{ mb: 1 }}
                        >
                          Guardando imágenes...
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={imageUploadProgress}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {imageUploadProgress}%
                        </Typography>
                      </Box>
                    )}
                    {/* Estado de guardado de nota */}
                    {isSavingNote && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="primary.main">
                          Guardando nota...
                        </Typography>
                        <LinearProgress />
                      </Box>
                    )}
                    {/* Errores de subida de imágenes */}
                    {imageUploadError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {imageUploadError}
                      </Alert>
                    )}

                    <Box
                      component="label"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      sx={{
                        border: "2px dashed #bbb",
                        borderRadius: 2,
                        p: 3,
                        mb: 2,
                        textAlign: "center",
                        background: "#f8fafc",
                        minHeight: 120,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 2,
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        boxShadow: 1,
                        "&:hover": {
                          boxShadow: 4,
                          borderColor: "primary.main",
                          background: "#f0f4ff",
                          transform: "translateY(-2px)",
                        },
                        "&:active": {
                          transform: "translateY(0)",
                        },
                      }}
                    >
                      <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <ImageIcon
                        sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
                      />
                      <Typography
                        variant="h6"
                        color="primary.main"
                        fontWeight={600}
                      >
                        Subir imágenes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Arrastra imágenes aquí o haz clic para seleccionar
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ opacity: 0.7 }}
                      >
                        PNG, JPG, GIF hasta 10MB
                      </Typography>
                    </Box>

                    {/* Grid de imágenes subidas */}
                    {getAllImages.length > 0 && (
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        {getAllImages.map((url, idx) => (
                          <Grid item key={url} xs={6} sm={4} md={3} lg={2}>
                            <Box
                              sx={{
                                position: "relative",
                                display: "inline-block",
                                borderRadius: 2,
                                overflow: "hidden",
                                boxShadow: 2,
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                  boxShadow: 6,
                                },
                              }}
                            >
                              <Avatar
                                src={url}
                                variant="rounded"
                                sx={{
                                  width: 100,
                                  height: 100,
                                  boxShadow: 1,
                                  transition: "box-shadow 0.2s",
                                }}
                                onClick={() => handleImageClick(idx)}
                              />

                              {/* Overlay con iconos */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: "rgba(0,0,0,0.3)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  opacity: 0,
                                  transition: "opacity 0.2s",
                                  "&:hover": {
                                    opacity: 1,
                                  },
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => handleImageClick(idx)}
                                  sx={{
                                    color: "white",
                                    bgcolor: "rgba(0,0,0,0.5)",
                                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Box>

                              <IconButton
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  bgcolor: "background.paper",
                                  boxShadow: 2,
                                  zIndex: 2,
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    bgcolor: "error.main",
                                    color: "white",
                                    transform: "scale(1.1)",
                                  },
                                }}
                                onClick={() => handleRemoveImage(url)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Grid>
                  {/* Sección avanzada */}
                  <Grid item xs={12}>
                    <Accordion sx={{ mt: 2, borderRadius: 2, boxShadow: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "primary.main",
                            fontWeight: 700,
                          }}
                        >
                          <AccessTimeIcon fontSize="small" /> Avanzado
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AccessTimeIcon fontSize="small" color="primary" />
                            <Typography variant="body2" color="text.secondary">
                              Word count: <b>123</b>
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AccessTimeIcon fontSize="small" color="primary" />
                            <Typography variant="body2" color="text.secondary">
                              Read time: <b>1 min</b>
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CalendarTodayIcon
                              fontSize="small"
                              color="primary"
                            />
                            <Typography variant="body2" color="text.secondary">
                              Creada: <b>2024-07-02</b>
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CalendarTodayIcon
                              fontSize="small"
                              color="primary"
                            />
                            <Typography variant="body2" color="text.secondary">
                              Actualizada: <b>2024-07-02</b>
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </Grid>
              </Box>
            )}
            {/* Success message */}
            {messageSaved && showAlert && (
              <Alert severity="success" onClose={() => setShowAlert(false)}>
                {messageSaved}
              </Alert>
            )}
          </Box>

          {/* Image Modal */}
          <ImageModal
            open={modalOpen}
            onClose={handleModalClose}
            images={getAllImages}
            currentIndex={currentImageIndex}
            onImageChange={handleImageChange}
          />
        </>
      )}
    </Box>
  )
})
