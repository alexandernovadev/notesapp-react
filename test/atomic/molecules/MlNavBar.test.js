import React from "react"
import { render, fireEvent } from "@testing-library/react"
import MlNavBar from "../../../src/atomic/molecules/ml-navbar"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"

const mockStore = configureStore([])
const store = mockStore({
  journal: {
    notes: [
      {
        id: 1,
        title: "Test Note 1",
        body: "This is a test note 1",
        date: new Date(),
      },
      {
        id: 2,
        title: "Test Note 2",
        body: "This is a test note 2",
        date: new Date(),
      },
    ],
  },
})

describe("MlNavBar Molecule", () => {
  it("should render without crashing", () => {
    const { container } = render(
      <Provider store={store}>
        <MlNavBar isOpen={true} onClose={() => {}} />
      </Provider>
    )
    expect(container).toBeTruthy()
  })

  it("should render correct number of MlItemSideBarNote components", () => {
    const { getAllByRole } = render(
      <Provider store={store}>
        <MlNavBar isOpen={true} onClose={() => {}} />
      </Provider>
    )
    const noteItems = getAllByRole("button")
    expect(noteItems.length).toBe(2)
  })

  it("should call onClose when close icon is clicked", () => {
    const onCloseMock = jest.fn()
    const { getByTestId } = render(
      <Provider store={store}>
        <MlNavBar isOpen={true} onClose={onCloseMock} />
      </Provider>
    )
    const closeIcon = getByTestId("close-icon")
    fireEvent.click(closeIcon)
    expect(onCloseMock).toHaveBeenCalled()
  })

  it('should render "Sin Notas" message when there are no notes', () => {
    const emptyStore = mockStore({ journal: { notes: [] } })
    const { getByText } = render(
      <Provider store={emptyStore}>
        <MlNavBar isOpen={true} onClose={() => {}} />
      </Provider>
    )
    expect(getByText(/Sin Notas/i)).toBeInTheDocument()
  })
})
