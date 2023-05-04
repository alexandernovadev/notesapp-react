import React from "react"
import { render } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import AtLink from "../../../src/atomic/atoms/at-link"

describe("AtLink Atom", () => {
  test("renders link with text and correct href", () => {
    const { getByText } = render(
      <Router>
        <AtLink to="/test">Test Link</AtLink>
      </Router>
    )

    const link = getByText("Test Link")

    expect(link).toBeInTheDocument()
    expect(link.getAttribute("href")).toBe("/test")
  })

  test("renders with the correct color prop", () => {
    const { getByText } = render(
      <Router>
        <AtLink to="/test" color="primary">
          Test Link
        </AtLink>
      </Router>
    )

    const link = getByText("Test Link")

    expect(link).toBeInTheDocument()
    expect(link).toHaveStyle("color: #1976d2")
  })

  test("passes through custom props correctly", () => {
    const { getByTestId } = render(
      <Router>
        <AtLink to="/test" data-testid="custom-link">
          Test Link
        </AtLink>
      </Router>
    )

    const link = getByTestId("custom-link")

    expect(link).toHaveAttribute("data-testid", "custom-link")
  })
})
