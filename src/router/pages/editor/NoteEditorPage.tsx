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
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material"
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import { useNavigate, useParams } from "react-router-dom"
import { NoteEditor } from "@/components/editor"
import { useNoteEditor } from "@/hooks/useNoteEditor"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import TagIcon from "@mui/icons-material/Tag"
import PaletteIcon from "@mui/icons-material/Palette"
import CategoryIcon from "@mui/icons-material/Category"
import ImageIcon from "@mui/icons-material/Image"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { CATEGORY_OPTIONS, TAG_OPTIONS, COLOR_PALETTE } from "@/utils/noteOptions"

export const NoteEditorPage: React.FC = () => {
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
  } = useNoteEditor({
    noteId: noteId || undefined,
    autoSave: true,
    autoSaveDelay: 2000,
  })

  const [category, setCategory] = React.useState(active?.category || "Personal")
  const [tags, setTags] = React.useState<string[]>(active?.tags || [])
  const [color, setColor] = React.useState(active?.color || "#f8fafc")
  const [priority, setPriority] = React.useState(active?.priority || "medium")
  const [images, setImages] = React.useState<string[]>(active?.imageUrls || [])

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("¿Deseas salir sin guardar los cambios?")
      if (!confirmed) return
    }
    navigate("/")
  }

  const handleSave = async () => {
    // Aquí podrías actualizar el store para guardar category y tags
    // Por ahora, solo log para debug
    console.log({ title, content, category, tags })
    await save()
  }

  // Debug: log content and title when they change
  React.useEffect(() => {
    console.log("NoteEditorPage debug:", { noteId, title, content })
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

  // Handler para imágenes (placeholder, drag & drop no funcional aún)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const urls = Array.from(files).map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...urls])
  }
  const handleRemoveImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url))
  }

  // Mostrar loading si hay noteId pero el contenido está vacío y no se está guardando
  if (noteId && !content && !isSaving) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Cargando nota...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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
          <Tooltip title="Guardar (Ctrl+S)" arrow>
            {isSaving || !hasUnsavedChanges ? (
              <span>
                <IconButton onClick={handleSave} disabled color="primary">
                  <SaveIcon />
                </IconButton>
              </span>
            ) : (
              <IconButton onClick={handleSave} color="primary">
                <SaveIcon />
              </IconButton>
            )}
          </Tooltip>
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
        sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2, gap: 2 }}
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
                <IconButton color={active?.isFavorite ? "primary" : "default"}>
                  <StarIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Fijar nota">
                <Switch checked={active?.isPinned || false} color="primary" />
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
                          "&:hover": { boxShadow: 3, transform: "scale(1.08)" },
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
                        border: color === c ? "2.5px solid" : "1px solid #eee",
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
                <Box
                  sx={{
                    border: "2px dashed #bbb",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    textAlign: "center",
                    background: "#f8fafc",
                    minHeight: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    transition: "box-shadow 0.2s",
                    boxShadow: 1,
                    "&:hover": { boxShadow: 4 },
                  }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                  >
                    Subir imágenes
                    <input
                      hidden
                      accept="image/*"
                      multiple
                      type="file"
                      onChange={handleImageUpload}
                    />
                  </Button>
                  {images.length === 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: "text.secondary",
                        mt: 1,
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2">
                        Arrastra imágenes aquí o usa el botón
                      </Typography>
                    </Box>
                  )}
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {images.map((url, idx) => (
                      <Grid item key={url} xs={6} sm={4} md={3} lg={2}>
                        <Box
                          sx={{
                            position: "relative",
                            display: "inline-block",
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: 2,
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "scale(1.06)",
                              boxShadow: 6,
                            },
                          }}
                        >
                          <Avatar
                            src={url}
                            variant="rounded"
                            sx={{
                              width: 80,
                              height: 80,
                              boxShadow: 1,
                              transition: "box-shadow 0.2s",
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              bgcolor: "background.paper",
                              boxShadow: 1,
                              zIndex: 2,
                              transition: "all 0.2s",
                              "&:hover": {
                                bgcolor: "error.main",
                                color: "white",
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
                </Box>
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
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AccessTimeIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Word count: <b>123</b>
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AccessTimeIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Read time: <b>1 min</b>
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarTodayIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Creada: <b>2024-07-02</b>
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarTodayIcon fontSize="small" color="primary" />
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
    </Box>
  )
}
