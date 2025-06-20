import {
  loginWithEmailPassword,
  logoutFirebase,
  singInWithGoogle,
} from "../../../src/firebase/providers"
import {
  checkingCredentials,
  login,
  logout,
} from "../../../src/store/auth/AuthSlice"
import {
  checkingAuthentication,
  startGoogleSignIn,
  startLoginWithEmailPassword,
  startLogout,
} from "../../../src/store/auth/thunks"
import { clearNotesLogout } from "../../../src/store/journal/JournalSlice"
import { demoUser } from "../../fixtures/authFixture"

jest.mock("../../../src/firebase/providers")

describe("Pruebas en AuthThunks", () => {
  const dispatch = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  test("Should invoke checkingCredentials", async () => {
    await checkingAuthentication()(dispatch)
    expect(dispatch).toHaveBeenCalledWith(checkingCredentials())
  })

  test("startGoogleSignIn should call checkingCredentialsy login - Success", async () => {
    const loginData = { ok: true, ...demoUser }
    await singInWithGoogle.mockResolvedValue(loginData)

    // thunk
    await startGoogleSignIn()(dispatch)

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials())
    expect(dispatch).toHaveBeenCalledWith(login(loginData))
  })

  test("startGoogleSignIn should call  checkingCredentials and logout - Error", async () => {
    const loginData = { ok: false, errorMessage: "Un error en Google" }
    await singInWithGoogle.mockResolvedValue(loginData)

    // thunk
    await startGoogleSignIn()(dispatch)

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials())
    expect(dispatch).toHaveBeenCalledWith(logout(loginData.errorMessage))
  })

  test("startLoginWithEmailPassword should call checkingCredentials and login - Success", async () => {
    const loginData = { ok: true, ...demoUser }
    const formData = { email: demoUser.email, password: "123456" }

    await loginWithEmailPassword.mockResolvedValue(loginData)

    await startLoginWithEmailPassword(formData)(dispatch)

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials())
    expect(dispatch).toHaveBeenCalledWith(login(loginData))
  })

  test("startLogout should call logoutFirebase, clearNotes and logout", async () => {
    await startLogout()(dispatch)

    expect(logoutFirebase).toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith(clearNotesLogout())
    expect(dispatch).toHaveBeenCalledWith(logout())
  })
})
