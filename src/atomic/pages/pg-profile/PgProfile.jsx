import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import AtBox from "../../atoms/at-box"
import AtGrid from "../../atoms/at-grid"
import AtTypography from "../../atoms/at-typography"
import AtAvatar from "../../atoms/at-avatar"
import AtButton from "../../atoms/at-button"
import AtDivider from "../../atoms/at-divider"
import TmDashlayout from "../../templates/tm-dashlayout"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"
import { startUpdateUserProfile } from "../../../store/auth/thunks"

const PgProfile = () => {
  const { displayName, email, photoURL } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [editName, setEditName] = useState(displayName || "")
  const [editPhoto, setEditPhoto] = useState(photoURL || "")
  const [saving, setSaving] = useState(false)

  const getInitials = (name) => {
    if (!name) return "?"
    const names = name.trim().split(" ")
    if (names.length === 1) return names[0][0].toUpperCase()
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }

  const handleEdit = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleSave = async () => {
    setSaving(true)
    await dispatch(startUpdateUserProfile({ displayName: editName, photoURL: editPhoto }))
    setSaving(false)
    setOpen(false)
  }

  return (
    <TmDashlayout>
      <AtBox sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, background: "#fff", borderRadius: 3, boxShadow: 3 }}>
        <AtGrid container spacing={2} alignItems="center">
          <AtGrid item>
            <AtAvatar src={photoURL} alt={displayName} sx={{ width: 80, height: 80, fontSize: 36 }}>
              {getInitials(displayName)}
            </AtAvatar>
          </AtGrid>
          <AtGrid item xs>
            <AtTypography variant="h4" fontWeight={700}>{displayName || "Usuario"}</AtTypography>
            <AtTypography variant="subtitle1" color="text.secondary">{email}</AtTypography>
            <AtButton variant="outlined" sx={{ mt: 2 }} onClick={handleEdit}>Editar perfil</AtButton>
          </AtGrid>
        </AtGrid>
        <AtDivider sx={{ my: 3 }} />
        <AtTypography variant="h6" fontWeight={600} gutterBottom>Información personal</AtTypography>
        <AtTypography variant="body1">Nombre: {displayName || "No especificado"}</AtTypography>
        <AtTypography variant="body1">Correo: {email || "No especificado"}</AtTypography>
        <AtDivider sx={{ my: 3 }} />
        <AtTypography variant="h6" fontWeight={600} gutterBottom>Actividad reciente</AtTypography>
        <AtTypography variant="body2" color="text.secondary">Aquí podrías ver tus últimas notas, cambios o actividad relevante.</AtTypography>
        <AtDivider sx={{ my: 3 }} />
        <AtTypography variant="h6" fontWeight={600} gutterBottom>Opciones</AtTypography>
        <AtButton variant="contained" color="primary" sx={{ mr: 2 }}>Cambiar contraseña</AtButton>
        <AtButton variant="outlined" color="error">Eliminar cuenta</AtButton>
      </AtBox>
      {/* Modal de edición */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar perfil</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            value={editName}
            onChange={e => setEditName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="URL de foto (opcional)"
            type="text"
            fullWidth
            value={editPhoto}
            onChange={e => setEditPhoto(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <AtButton onClick={handleClose} disabled={saving}>Cancelar</AtButton>
          <AtButton onClick={handleSave} variant="contained" disabled={saving || !editName.trim()}>
            Guardar
          </AtButton>
        </DialogActions>
      </Dialog>
    </TmDashlayout>
  )
}

export default PgProfile 