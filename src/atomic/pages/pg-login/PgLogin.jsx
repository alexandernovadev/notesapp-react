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
    console.log("entra ?");
    setFormSubmitted(true)
    dispatch(startGoogleSignIn())
  }

  return (
    <TmAuthLayout title="Login">
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
            />
          </AtGrid>

          <AtGrid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <AtGrid item xs={12} display={!!errorMessage ? "" : "none"}>
              <MlAlert type="error" errorMessage={errorMessage} />
            </AtGrid>

            <AtGrid item xs={12} sm={6}>
              <AtButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={isAuthenticated}
              >
                Login
              </AtButton>
            </AtGrid>
            <AtGrid item xs={12} sm={6}>
              <AtButton
                onClick={onGoogleSignIn}
                variant="contained"
                fullWidth
                disabled={isAuthenticated}
              >
                <Google />
                <AtTypography sx={{ ml: 1 }}>Google</AtTypography>
              </AtButton>
            </AtGrid>
          </AtGrid>

          <AtGrid container direction="row" justifyContent="end">
            <AtLink component={RouterLink} color="inherit" to="/auth/register">
              Crear una cuenta
            </AtLink>
          </AtGrid>
        </AtGrid>
      </form>
    </TmAuthLayout>
  )
}

export default PgLogin
