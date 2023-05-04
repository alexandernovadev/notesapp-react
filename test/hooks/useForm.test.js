import {
  renderHook,
  act,
  waitForNextUpdate,
} from "@testing-library/react-hooks"
import { useForm } from "../../src/hooks/useForm"

describe("Test in use Form Hook", () => {
  const initialForm = {
    email: "",
    password: "",
  }

  const formValidations = {
    email: [(value) => value.includes("@"), "Email must include an @"],
    password: [
      (value) => value.length >= 8,
      "Password must be at least 8 characters",
    ],
  }

  // it("should handle form state and input changes correctly", () => {
  //   const { result } = renderHook(() => useForm(initialForm, formValidations))

  //   expect(result.current.email).toBe("")
  //   expect(result.current.password).toBe("")

  //   act(() => {
  //     result.current.onInputChange({
  //       target: { name: "email", value: "test@example.com" },
  //     })
  //   })

  //   expect(result.current.email).toBe("test@example.com")
  // })

  // it("should reset form state correctly", () => {
  //   const { result } = renderHook(() => useForm(initialForm, formValidations))

  //   act(() => {
  //     result.current.onInputChange({
  //       target: { name: "email", value: "test@example.com" },
  //     })
  //     result.current.onInputChange({
  //       target: { name: "password", value: "password123" },
  //     })
  //   })

  //   act(() => {
  //     result.current.onResetForm()
  //   })

  //   expect(result.current.email).toBe("")
  //   expect(result.current.password).toBe("")
  // })


})
