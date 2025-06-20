import React from "react"
import { render } from "@testing-library/react"
import AtBox from "../../../src/atomic/atoms/at-box"
import { createTheme, ThemeProvider } from "@mui/material/styles"

const theme = createTheme()

describe("AtBox Atom", () => {
  it("renders without crashing", () => {
    render(<AtBox />)
  })

  it("renders children content", () => {
    const { getByText } = render(<AtBox>Child Content</AtBox>)
    const childContent = getByText("Child Content")

    expect(childContent).toBeInTheDocument()
  })

  it("renders with custom CSS properties", () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <AtBox data-testid="custom-box" bgcolor="primary.main" padding="2rem">
          Content
        </AtBox>
      </ThemeProvider>
    )
    const boxElement = getByTestId("custom-box")
    const primaryColor = theme.palette.primary.main

    expect(boxElement).toHaveStyle({
      backgroundColor: primaryColor,
      padding: "2rem",
    })
  })

  it("renders with custom CSS class", () => {
    const { getByTestId } = render(
      <AtBox data-testid="custom-box" className="custom-box-class">
        Content
      </AtBox>
    )
    const boxElement = getByTestId("custom-box")

    expect(boxElement).toHaveClass("custom-box-class")
  })
})
