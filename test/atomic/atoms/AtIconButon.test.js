import React from "react"
import { render, fireEvent } from "@testing-library/react"
import { IconButton } from "@mui/material"
import AtIconButton from "../../../src/atomic/atoms/at-iconbutton"

describe("AtIconButton Atom", () => {
  it("renders without crashing", () => {
    render(<AtIconButton />)
  })

  it("renders children content", () => {
    const { getByTestId } = render(
      <AtIconButton>
        <div data-testid="iconbutton-child">Child</div>
      </AtIconButton>
    )
    const childElement = getByTestId("iconbutton-child")
    expect(childElement).toBeInTheDocument()
  })

  it("renders with custom CSS properties", () => {
    const { getByRole } = render(
      <AtIconButton
        data-testid="custom-iconbutton"
        style={{ backgroundColor: "red", borderRadius: "50%" }}
      />
    )
    const iconButtonElement = getByRole("button")

    expect(iconButtonElement).toHaveStyle({
      backgroundColor: "red",
      borderRadius: "50%",
    })
  })

  it("handles click events", () => {
    const handleClick = jest.fn()
    const { getByRole } = render(
      <AtIconButton onClick={handleClick}>
        <div>Child</div>
      </AtIconButton>
    )
    const iconButtonElement = getByRole("button")
    fireEvent.click(iconButtonElement)
    expect(handleClick).toHaveBeenCalled()
  })
})
