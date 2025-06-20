import { useMemo, useState } from "react"
import { Link as RouterLink } from "react-router"
import { Google } from "@mui/icons-material"
import { useForm } from "../../../hooks/useForm"
import { useDispatch, useSelector } from "react-redux"

import AtTextField from "../../atoms/at-textfield"
import AtGrid from "../../atoms/at-grid"
import AtTypography from "../../atoms/at-typography"
import AtLink from "../../atoms/at-link"
import AtButton from "../../atoms/at-button"
import MlAlert from "../../molecules/ml-alert"
import TmAuthLayout from "../../templates/tm-authlayuot"

import {
  startLoginWithEmailPassword,
  startGoogleSignIn,
} from "../../../store/auth/thunks"

import notesIcon from "../../../assets/notesIcon.png"

const formData = {
  email: "demouser@demo.com",
  password: "soydemo123",
}

const formValidations = {
  email: [(value) => value.includes("@"), "El correo debe de tener una @"],
}

export const PgLogin = () => {
  const dispatch = useDispatch()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const { status, errorMessage } = useSelector((state) => state.auth)

  const { formState, email, password, isFormValid, emailValid, onInputChange } =
    useForm(formData, formValidations)

  const isAuthenticated = useMemo(() => status === "checking", [status])

  const onSubmit = (e) => {
    e.preventDefault()

    if (!isFormValid) return
    dispatch(startLoginWithEmailPassword({ email, password }))
  }

  const onGoogleSignIn = () => {
    console.log("entra ?")
    setFormSubmitted(true)
    dispatch(startGoogleSignIn())
  }

  return (
    <TmAuthLayout title={null}>
      <AtTypography
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 28,
          mb: 1,
          color: "primary.main",
          letterSpacing: 1,
        }}
      >
        notasFire
      </AtTypography>
      <img
        src={notesIcon}
        alt="Notas"
        style={{
          display: "block",
          margin: "0 auto 8px",
          width: 48,
          height: 48,
        }}
      />
      <AtTypography
        sx={{
          mb: 2,
          textAlign: "center",
          color: "text.secondary",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        Esta aplicación es una demo para mostrar habilidades técnicas. El
        registro está deshabilitado y se utiliza un usuario de prueba por
        defecto.
        <br />
        Haz click en el botón de Login para iniciar sesión automáticamente.
      </AtTypography>
      <form
        onSubmit={onSubmit}
        className="animate__animated animate__fadeIn animate__faster"
      >
        <AtGrid container>
          <AtGrid item xs={12} sx={{ mt: 2 }}>
            <AtTextField
              label="Correo"
              fullWidth
              type="email"
              placeholder="correo@google.com"
              name="email"
              value={email}
              onChange={onInputChange}
              error={!!emailValid && formSubmitted}
              helperText={emailValid}
              disabled
            />
          </AtGrid>

          <AtGrid item xs={12} sx={{ mt: 2 }}>
            <AtTextField
              label="Contraseña"
              type="text"
              placeholder="Contraseña"
              fullWidth
              name="password"
              value={password}
              onChange={onInputChange}
              disabled
            />
          </AtGrid>

          <AtGrid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <AtGrid item xs={12} display={!!errorMessage ? "" : "none"}>
              <MlAlert type="error" errorMessage={errorMessage} />
            </AtGrid>

            <AtGrid item xs={12} sm={6}>
              <AtButton type="submit" variant="contained" fullWidth>
                Login
              </AtButton>
            </AtGrid>

            <AtGrid item xs={12} sm={6} sx={{ cursor: "not-allowed" }}>
              <AtButton
                onClick={onGoogleSignIn}
                variant="contained"
                fullWidth
                disabled
                sx={{ opacity: 0.5 }}
              >
                <Google />
                <AtTypography sx={{ ml: 1 }}>Google</AtTypography>
              </AtButton>
            </AtGrid>
          </AtGrid>

          <AtGrid container direction="row" justifyContent="end">
            <span style={{ cursor: "not-allowed" }}>Crear una cuenta</span>
          </AtGrid>
        </AtGrid>
      </form>
    </TmAuthLayout>
  )
}

export default PgLogin
