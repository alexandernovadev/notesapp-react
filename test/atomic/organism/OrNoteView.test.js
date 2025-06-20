import React from "react"
import { render, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import OrNoteView from "../../../src/atomic/organisms/or-noteview"
import { startSaveNote } from "../../../src/store/journal/thunks"

const mockStore = configureStore([])

describe("OrNoteView Organism", () => {
  let store

  beforeEach(() => {
    store = mockStore({
      journal: {
        active: {
          id: "test-note-id",
          title: "Test Note Title",
          body: "Test Note Body",
          date: new Date(),
        },
        isSaving: false,
        messageSaved: "",
      },
    })

    store.dispatch = jest.fn()
  })

  test("renders correctly", () => {
    render(
      <Provider store={store}>
        <OrNoteView />
      </Provider>
    )
  })

  test("renders the note title and body", () => {
    const { getByLabelText, getByPlaceholderText } = render(
      <Provider store={store}>
        <OrNoteView />
      </Provider>
    )

    const titleInput = getByLabelText("Título")
    const bodyInput = getByPlaceholderText("¿Qué sucedió en el día de hoy?")

    expect(titleInput.value).toBe("Test Note Title")
    expect(bodyInput.value).toBe("Test Note Body")
  })

  test("updates title correctly", () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <OrNoteView />
      </Provider>
    )

    const titleInput = getByLabelText("Título")

    fireEvent.change(titleInput, { target: { value: "New Title" } })

    expect(titleInput.value).toBe("New Title")
  })

  test("updates body correctly", () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <OrNoteView />
      </Provider>
    )

    const bodyInput = getByPlaceholderText("¿Qué sucedió en el día de hoy?")

    fireEvent.change(bodyInput, { target: { value: "New Body" } })

    expect(bodyInput.value).toBe("New Body")
  })

  // test("saves note correctly", () => {
  //   const { getByText } = render(
  //     <Provider store={store}>
  //       <OrNoteView />
  //     </Provider>
  //   )

  //   const saveButton = getByText("Guardar")

  //   fireEvent.click(saveButton)

  //   const startSaveNoteAction = startSaveNote();
  //   expect(store.dispatch).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       type: startSaveNoteAction.type,
  //       payload: expect.anything(),
  //     })
  //   );
  // })
})
