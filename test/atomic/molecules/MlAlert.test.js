import React from "react"
import { render } from "@testing-library/react"
import MlAlert from "../../../src/atomic/molecules/ml-alert"

describe("MlAlert Molecule", () => {
  it("renders without crashing", () => {
    render(<MlAlert errorMessage="Test error message" />)
  })

  it("renders with default type", () => {
    const { getByRole } = render(<MlAlert errorMessage="Test error message" />)
    const alertElement = getByRole("alert")
    expect(alertElement).toHaveClass("MuiAlert-standardError")
  })

  it("renders with a custom type", () => {
    const { getByRole } = render(
      <MlAlert errorMessage="Test success message" type="success" />
    )
    const alertElement = getByRole("alert")
    expect(alertElement).toHaveClass("MuiAlert-standardSuccess")
  })

  it("renders error message", () => {
    const { getByText } = render(<MlAlert errorMessage="Test error message" />)
    const errorMessageElement = getByText("Test error message")
    expect(errorMessageElement).toBeInTheDocument()
  })
})
