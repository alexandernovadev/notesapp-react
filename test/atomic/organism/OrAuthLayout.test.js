import React from "react"
import { render } from "@testing-library/react"
import OrAuthLayout from "../../../src/atomic/organisms/or-authlayout"

describe("OrAuthLayout Organism", () => {
  it("should render without crashing", () => {
    const { container } = render(<OrAuthLayout />)
    expect(container).toBeTruthy()
  })

  it("should render the title prop", () => {
    const { getByText } = render(<OrAuthLayout title="Test Title" />)
    expect(getByText("Test Title")).toBeInTheDocument()
  })

  it("should render children elements", () => {
    const Child = () => <div data-testid="child">Child component</div>
    const { getByTestId } = render(
      <OrAuthLayout>
        <Child />
      </OrAuthLayout>
    )

    expect(getByTestId("child")).toBeInTheDocument()
  })

  it("should render the default title if no title prop is provided", () => {
    const { getByRole } = render(<OrAuthLayout />)
    expect(getByRole("heading")).toBeInTheDocument()
  })
})
