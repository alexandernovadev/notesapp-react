import React from "react"
import { render } from "@testing-library/react"
import OrNoSelected from "../../../src/atomic/organisms/or-noselected"

describe("OrNoSelected Organism", () => {
  it("should render without crashing", () => {
    const { container } = render(<OrNoSelected />)
    expect(container).toBeTruthy()
  })

  it("should render the welcome message", () => {
    const { getByText } = render(<OrNoSelected />)
    expect(getByText("¡Bienvenido a NotesApp!")).toBeInTheDocument()
  })

  it("should render the image", () => {
    const { getByAltText } = render(<OrNoSelected />)
    expect(getByAltText("ImageMain")).toBeInTheDocument()
  })

  it('should render the "Comienza agregando una Nota" message', () => {
    const { getByText } = render(<OrNoSelected />)
    expect(getByText("Comienza agregando una Nota")).toBeInTheDocument()
  })

  it("should render the down arrow image", () => {
    const { getByAltText } = render(<OrNoSelected />)
    expect(getByAltText("Arrow Down Icon")).toBeInTheDocument()
  })
})
