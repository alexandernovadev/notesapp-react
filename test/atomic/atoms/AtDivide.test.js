import React from "react"
import { render } from "@testing-library/react"
import AtDivider from "../../../src/atomic/atoms/at-divider"

describe("AtDivider Atom", () => {
  it("renders without crashing", () => {
    render(<AtDivider />)
  })

  it("renders with custom CSS properties", () => {
    const { getByTestId } = render(
      <AtDivider
        data-testid="custom-divider"
        style={{ height: "3px", backgroundColor: "red" }}
      />
    )
    const dividerElement = getByTestId("custom-divider")

    expect(dividerElement).toHaveStyle({
      height: "3px",
      backgroundColor: "red",
    })
  })

  it("renders with custom CSS class", () => {
    const { getByTestId } = render(
      <AtDivider
        data-testid="custom-divider"
        className="custom-divider-class"
      />
    )
    const dividerElement = getByTestId("custom-divider")

    expect(dividerElement).toHaveClass("custom-divider-class")
  })
})
