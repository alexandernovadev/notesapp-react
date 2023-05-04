import React from "react"
import { render } from "@testing-library/react"
import AtTypography from "../../../src/atomic/atoms/at-typography"

describe("AtTypography Atom", () => {
  it("renders without crashing", () => {
    render(<AtTypography />)
  })

  it("renders with default variant", () => {
    const { getByText } = render(<AtTypography>Default Text</AtTypography>)
    const typographyElement = getByText("Default Text")
    expect(typographyElement).toHaveClass("MuiTypography-body1")
  })

  it("renders with a custom variant", () => {
    const { getByText } = render(
      <AtTypography variant="h1">Custom Variant Text</AtTypography>
    )
    const typographyElement = getByText("Custom Variant Text")
    expect(typographyElement).toHaveClass("MuiTypography-h1")
  })

  it("renders children content", () => {
    const { getByText } = render(
      <AtTypography>
        <span>Child Content</span>
      </AtTypography>
    )
    const childElement = getByText("Child Content")
    expect(childElement).toBeInTheDocument()
  })
})
