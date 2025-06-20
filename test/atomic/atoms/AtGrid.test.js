import React from "react"
import { render } from "@testing-library/react"
import AtGrid from "../../../src/atomic/atoms/at-grid"

describe("AtGrid Atom", () => {
  test("renders without errors", () => {
    const { getByTestId } = render(
      <AtGrid container data-testid="at-grid-test">
        <div>Child Component</div>
      </AtGrid>
    )
    const atGridElement = getByTestId("at-grid-test")
    expect(atGridElement).toBeInTheDocument()
  })

  test("renders children", () => {
    const { getByText } = render(
      <AtGrid container>
        <div>Child Component</div>
      </AtGrid>
    )
    const childElement = getByText("Child Component")
    expect(childElement).toBeInTheDocument()
  })
})
