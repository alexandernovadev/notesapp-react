import React from "react"
import { render, fireEvent } from "@testing-library/react"
import AtButton from "../../../src/atomic/atoms/at-button"

describe("Button Atom", () => {
  test("renders button with text", () => {
    const { getByText } = render(<AtButton>Test Button</AtButton>)
    expect(getByText("Test Button")).toBeInTheDocument()
  })

  test("calls onClick handler when button is clicked", () => {
    const onClickMock = jest.fn()
    const { getByText } = render(
      <AtButton onClick={onClickMock}>Test Button</AtButton>
    )

    fireEvent.click(getByText("Test Button"))
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  test("applies default and custom props correctly", () => {
    const { getByTestId, rerender } = render(
      <AtButton data-testid="button">Test Button</AtButton>
    )

    const button = getByTestId("button")

    expect(button).toHaveAttribute("data-testid", "button")
    expect(button).toHaveClass("MuiButton-contained")
    expect(button).toHaveClass("MuiButton-containedPrimary")

    rerender(
      <AtButton data-testid="button" variant="outlined" color="secondary">
        Test Button
      </AtButton>
    )

    expect(button).toHaveClass("MuiButton-outlined")
    expect(button).toHaveClass("MuiButton-outlinedSecondary")
  })
})
