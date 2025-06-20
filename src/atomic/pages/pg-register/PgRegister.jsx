import { useState, useMemo } from "react"
import { Link as RouterLink } from "react-router"

import { useForm } from "../../../hooks/useForm"
import { useDispatch, useSelector } from "react-redux"
import { startCreatingUserWithEmailPassword } from "../../../store/auth/thunks"

import TmAuthLayout from "../../templates/tm-authlayuot"
import AtTypography from "../../atoms/at-typography"
import AtLink from "../../atoms/at-link"
import AtGrid from "../../atoms/at-grid"
import MlAlert from "../../molecules/ml-alert"
import AtButton from "../../atoms/at-button"
import AtTextField from "../../atoms/at-textfield"
import Tooltip from "@mui/material/Tooltip"

const formData = {
  email: "",
  password: "",
  displayName: "",
}
const formValidations = {
  email: [(value) => value.includes("@"), "El correo debe de tener una @"],
  password: [
    (value) => value.length >= 6,
    "El password debe de tener más de 6 letras.",
  ],
  displayName: [(value) => value.length >= 1, "El nombre es obligatorio."],
}

export const PgRegister = () => {
  const dispatch = useDispatch()

  const [formSubmitted, setFormSubmitted] = useState(false)

  const { status, errorMessage } = useSelector((state) => state.auth)

  const isCheckingAuth = useMemo(() => {
    return status === "checking"
  }, [status])

  const {
    formState,
    displayName,
    email,
    password,
    onInputChange,
    isFormValid,
    displayNameValid,
    emailValid,
    passwordValid,
  } = useForm(formData, formValidations)

  const onSubmit = (event) => {
    event.preventDefault()
    setFormSubmitted(true)

    if (!isFormValid) return

    dispatch(startCreatingUserWithEmailPassword(formState))
  }

  return (
    <TmAuthLayout title="Crear cuenta">
      <form
        onSubmit={onSubmit}
        className="animate__animated animate__fadeIn animate__faster"
      >
        <AtGrid container>
          <AtGrid item xs={12} sx={{ mt: 2 }}>
            <AtTextField
              label="Nombre completo"
              type="text"
              placeholder="Nombre completo"
              fullWidth
              name="displayName"
              value={displayName}
              onChange={onInputChange}
              error={!!displayNameValid && formSubmitted}
              helperText={displayNameValid}
            />
          </AtGrid>

          <AtGrid item xs={12} sx={{ mt: 2 }}>
            <AtTextField
              label="Correo"
              type="email"
              placeholder="correo@google.com"
              fullWidth
              name="email"
              value={email}
              onChange={onInputChange}
              error={!!emailValid && formSubmitted}
              helperText={emailValid}
            />
          </AtGrid>

          <AtGrid item xs={12} sx={{ mt: 2 }}>
            <AtTextField
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              fullWidth
              name="password"
              value={password}
              onChange={onInputChange}
              error={!!passwordValid && formSubmitted}
              helperText={passwordValid}
            />
          </AtGrid>

          <AtGrid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <AtGrid item xs={12} display={!!errorMessage ? "" : "none"}>
              <MlAlert severity="error">{errorMessage}</MlAlert>
            </AtGrid>

            <AtGrid item xs={12}>
              <Tooltip title="demoapp" arrow>
                <span>
                  <AtButton
                    disabled
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ opacity: 0.5, pointerEvents: 'none' }}
                  >
                    Crear cuenta
                  </AtButton>
                </span>
              </Tooltip>
            </AtGrid>
          </AtGrid>
        </AtGrid>
      </form>
    </TmAuthLayout>
  )
}

export default PgRegister
