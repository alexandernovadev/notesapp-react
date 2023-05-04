import React from "react"
import { render, fireEvent } from "@testing-library/react"
import MlAddEntry from "../../../src/atomic/molecules/ml-addentry"

describe("MlAddEntry Molecule", () => {
  it("renders without crashing", () => {
    render(<MlAddEntry />)
  })

  it("calls onClick prop when clicked", () => {
    const handleClick = jest.fn()
    const { getByRole } = render(<MlAddEntry onClick={handleClick} />)
    const buttonElement = getByRole("button")

    fireEvent.click(buttonElement)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("renders the AddOutlined icon", () => {
    const { getByTestId } = render(
      <MlAddEntry data-testid="add-entry-button" />
    )
    const iconElement = getByTestId("add-entry-button").querySelector(
      "svg.MuiSvgIcon-root"
    )
    expect(iconElement).toBeInTheDocument()
  })
})
