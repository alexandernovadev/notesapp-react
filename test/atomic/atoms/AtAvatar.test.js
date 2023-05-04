import React from "react"
import { render, fireEvent } from "@testing-library/react"
import AtAvatar from "../../../src/atomic/atoms/at-avatar"

describe("AtAvatar Atom", () => {
  test("renders with a given src", () => {
    const { getByRole } = render(
      <AtAvatar src="https://example.com/avatar.jpg" />
    )
    const avatarImage = getByRole("img")

    expect(avatarImage).toHaveAttribute("src", "https://example.com/avatar.jpg")
  })
  test("renders with a given alt", () => {
    const { getByLabelText } = render(<AtAvatar alt="Example avatar" />)
    const avatarElement = getByLabelText("Example avatar")

    expect(avatarElement).toBeInTheDocument()
  })
  test("renders with a custom CSS class", () => {
    const { container } = render(<AtAvatar className="custom-avatar-class" />)
    const avatarElement = container.querySelector(".MuiAvatar-root")

    expect(avatarElement).toHaveClass("custom-avatar-class")
  })
})
