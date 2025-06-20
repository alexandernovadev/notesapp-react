import React from "react"
import { render, fireEvent } from "@testing-library/react"
import MlItemSideBarNote from "../../../src/atomic/molecules/ml-itemsidebarnotes"

import { Provider } from "react-redux"
import configureStore from "redux-mock-store"

const mockStore = configureStore([])
const store = mockStore({})

describe("MlItemSideBarNote Molecule", () => {
  const mockNote = {
    id: 1,
    title: "This is a very long title that needs to be truncated",
    body: "Here there are a description that needs to be truncated",
    date: new Date(),
  }

  it("should render without crashing", () => {
    const { container } = render(
      <Provider store={store}>
        <MlItemSideBarNote {...mockNote} onClose={() => {}} />
      </Provider>
    )
    expect(container).toBeTruthy()
  })

  it("should truncate long titles", () => {
    const { getAllByText } = render(
      <Provider store={store}>
        <MlItemSideBarNote {...mockNote} onClose={() => {}} />
      </Provider>
    )
    const matchingElements = getAllByText(/This is a very.../i)
    expect(matchingElements[0]).toBeInTheDocument()
  })

  it("should dispatch setActiveNote action when clicked", () => {
    const { getByRole } = render(
      <Provider store={store}>
        <MlItemSideBarNote {...mockNote} onClose={() => {}} />
      </Provider>
    )
    store.clearActions()
    fireEvent.click(getByRole("button"))
    const actions = store.getActions()
    expect(actions[0].type).toBe("journal/setActiveNote")
    expect(actions[0].payload).toEqual({
      title: mockNote.title,
      body: mockNote.body,
      id: mockNote.id,
      date: mockNote.date,
    })
  })

  it("should call onClose function when clicked", () => {
    const onCloseMock = jest.fn()
    const { getByRole } = render(
      <Provider store={store}>
        <MlItemSideBarNote {...mockNote} onClose={onCloseMock} />
      </Provider>
    )
    fireEvent.click(getByRole("button"))
    expect(onCloseMock).toHaveBeenCalled()
  })
})
