import {
  loginWithEmailPassword,
  registerUserWithEmailPassword,
  singInWithGoogle,
  logoutFirebase,
  updateUserProfile,
} from "../../firebase/providers"
import { clearNotesLogout } from "../journal/JournalSlice"
import { checkingCredentials, logout, login } from "./AuthSlice"

export const checkingAuthentication = () => {
  return async (dispatch) => {
    dispatch(checkingCredentials())
  }
}

export const startGoogleSignIn = () => {
  return async (dispatch) => {
    dispatch(checkingCredentials())
    const result = await singInWithGoogle()

    if (!result.ok) return dispatch(logout(result.errorMessage))
    dispatch(login(result))
  }
}

export const startCreatingUserWithEmailPassword = ({
  email,
  password,
  displayName,
}) => {
  return async (dispatch) => {
    dispatch(checkingCredentials())

    const result = await registerUserWithEmailPassword({
      email,
      password,
      displayName,
    })
    if (!result.ok) return dispatch(logout(result.errorMessage))

    dispatch(login(result))
  }
}

export const startLoginWithEmailPassword = ({ email, password }) => {
  return async (dispatch) => {
    dispatch(checkingCredentials())

    const result = await loginWithEmailPassword({ email, password })

    if (!result.ok) return dispatch(logout(result.errorMessage))
    dispatch(login(result))
  }
}

export const startLogout = () => {
  return async (dispatch) => {
    await logoutFirebase()
    dispatch(clearNotesLogout())
    dispatch(logout())
  }
}

export const startUpdateUserProfile = ({ displayName, photoURL }) => {
  return async (dispatch, getState) => {
    dispatch(checkingCredentials())
    const result = await updateUserProfile({ displayName, photoURL })
    if (!result.ok) return dispatch(logout(result.errorMessage))
    // Actualiza el estado auth con los nuevos datos
    const { uid, email } = getState().auth
    dispatch(login({ uid, email, displayName: result.displayName, photoURL: result.photoURL }))
  }
}
