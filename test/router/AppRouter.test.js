import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import AppRouter from "../../src/router/AppRouter"
import { useCheckAuth } from "../../src/hooks/useCheckAuth"
import JournalRoutes from "../../src/router/JournalRoutes"
import AuthRoutes from "../../src/router/AuthRoutes"

jest.mock("../../src/hooks/useCheckAuth")
jest.mock("../../src/router/JournalRoutes", () => () => (
  <div>JournalRoutes</div>
))
jest.mock("../../src/router/JournalRoutes", () => () => (
  <div>JournalRoutes</div>
))

describe("Test In AppRouter", () => {
  it("should render TmLoadingLayout when checking authentication status", () => {
    useCheckAuth.mockReturnValue("checking")
    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    )

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("should render JournalRoutes when user is authenticated", async () => {
    useCheckAuth.mockReturnValue("authenticated")
    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    )

    await waitFor(() =>
      expect(screen.getByText("JournalRoutes")).toBeInTheDocument()
    )
  })
})
