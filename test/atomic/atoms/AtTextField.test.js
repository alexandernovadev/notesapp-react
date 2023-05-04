import React from "react"
import { render, fireEvent } from "@testing-library/react"
import AtTextField from "../../../src/atomic/atoms/at-textfield"

describe("AtTextField Atom", () => {
  it("renders without crashing", () => {
    render(<AtTextField />)
  })

  it("renders with a label", () => {
    const { getByLabelText } = render(<AtTextField label="Name" />)
    const textFieldElement = getByLabelText("Name")
    expect(textFieldElement).toBeInTheDocument()
  })
  it("renders with a custom variant", () => {
    const { container } = render(
      <AtTextField
        data-testid="custom-textfield"
        variant="standard"
        label="Name"
      />
    )
    const inputElement = container.querySelector("input.MuiInputBase-input")
    expect(inputElement).toHaveClass("MuiInput-input")
  })

  it("handles input changes", () => {
    const handleChange = jest.fn()
    const { getByLabelText } = render(
      <AtTextField label="Name" onChange={handleChange} />
    )
    const textFieldElement = getByLabelText("Name")

    fireEvent.change(textFieldElement, { target: { value: "John Doe" } })
    expect(handleChange).toHaveBeenCalled()
  })
})
