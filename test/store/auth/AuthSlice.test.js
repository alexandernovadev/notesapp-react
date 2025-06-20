import {
  authSlice,
  checkingCredentials,
  login,
  logout,
} from "../../../src/store/auth/AuthSlice"
import {
  authenticatedState,
  demoUser,
  initialState,
} from "../../fixtures/authFixture"

describe("Test in authSlice", () => {
  test('Should return initial state and call "auth"', () => {
    const state = authSlice.reducer(initialState, {})

    expect(state).toEqual(initialState)
    expect(authSlice.name).toBe("auth")
  })

  test("Should do authentication", () => {
    const state = authSlice.reducer(initialState, login(demoUser))
    expect(state).toEqual({
      status: "authenticated", // 'checking', 'not-authenticated', 'authenticated'
      uid: demoUser.uid,
      email: demoUser.email,
      displayName: demoUser.displayName,
      photoURL: demoUser.photoURL,
      errorMessage: null,
    })
  })

  test("Should do logout without args", () => {
    // authenticatedState // logout sin argumentos
    const state = authSlice.reducer(authenticatedState, logout())
    expect(state).toEqual({
      status: "not-authenticated",
      uid: null,
      email: null,
      displayName: null,
      photoURL: null,
      errorMessage: undefined,
    })
  })

  test("Should do logout and show error message", () => {
    const state = authSlice.reducer(
      authenticatedState,
      logout({ errorMessage })
    )
    
    // console.log("state", state)
    expect(state).toEqual({
      status: "not-authenticated",
      uid: null,
      email: null,
      displayName: null,
      photoURL: null,
      errorMessage: { errorMessage: "Credenciales no son correctas" },
    })
  })

  test("Shouuld changue state to checking", () => {
    const state = authSlice.reducer(authenticatedState, checkingCredentials())
    expect(state.status).toBe("checking")
  })
})
