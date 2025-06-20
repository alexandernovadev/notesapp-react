import React from "react"
import { useSelector } from "react-redux"
import AtBox from "../../atoms/at-box"
import AtGrid from "../../atoms/at-grid"
import AtTypography from "../../atoms/at-typography"
import AtDivider from "../../atoms/at-divider"
import AtButton from "../../atoms/at-button"
import TmDashlayout from "../../templates/tm-dashlayout"

const PgMyAccount = () => {
  const { email, displayName, photoURL } = useSelector((state) => state.auth)

  return (
    <TmDashlayout>
      <AtBox sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 3, background: "#fff", borderRadius: 3, boxShadow: 3 }}>
        <AtTypography variant="h4" fontWeight={700} gutterBottom>Mi Cuenta</AtTypography>
        <AtDivider sx={{ my: 2 }} />
        <AtTypography variant="h6" fontWeight={600} gutterBottom>Detalles de la cuenta</AtTypography>
        <AtGrid container spacing={2}>
          <AtGrid item xs={12} sm={6}>
            <AtTypography variant="body1">Nombre: {displayName || "No especificado"}</AtTypography>
            <AtTypography variant="body1">Correo: {email || "No especificado"}</AtTypography>
          </AtGrid>
          <AtGrid item xs={12} sm={6}>
            <AtTypography variant="body1">Tipo de cuenta: Básica</AtTypography>
            <AtTypography variant="body1">Estado: Activa</AtTypography>
          </AtGrid>
        </AtGrid>
        <AtDivider sx={{ my: 3 }} />
        <AtTypography variant="h6" fontWeight={600} gutterBottom>Configuración y preferencias</AtTypography>
        <AtTypography variant="body2" color="text.secondary">Aquí puedes personalizar notificaciones, idioma, y otras preferencias.</AtTypography>
        <AtButton variant="outlined" sx={{ mt: 2 }}>Configurar notificaciones</AtButton>
        <AtButton variant="outlined" sx={{ mt: 2, ml: 2 }}>Cambiar idioma</AtButton>
        <AtDivider sx={{ my: 3 }} />
        <AtTypography variant="h6" fontWeight={600} gutterBottom>Opciones avanzadas</AtTypography>
        <AtButton variant="contained" color="primary" sx={{ mr: 2 }}>Ver actividad</AtButton>
        <AtButton variant="outlined" color="error">Cerrar sesión</AtButton>
      </AtBox>
    </TmDashlayout>
  )
}

export default PgMyAccount 