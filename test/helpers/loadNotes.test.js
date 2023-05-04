import { loadNotes } from "../../src/helpers/loadNotes"
import { FirebaseDB } from "../../src/firebase/config"
import { collection, getDocs } from "firebase/firestore/lite"

jest.mock("../../src/firebase/config", () => ({
  FirebaseDB: {
    collection: jest.fn(),
  },
}))

jest.mock("firebase/firestore/lite", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}))

describe("loadNotes function", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return an array of notes for a given uid", async () => {
    const mockUid = "mockUid"
    const mockNote = { id: "mockId", title: "mockTitle", body: "mockBody" }
    const mockSnapshot = {
      forEach: (fn) =>
        fn({
          id: mockNote.id,
          data: () => mockNote,
        }),
    }

    collection.mockReturnValue(FirebaseDB)
    getDocs.mockReturnValue(Promise.resolve(mockSnapshot))

    const result = await loadNotes(mockUid)

    expect(collection).toHaveBeenCalledWith(
      FirebaseDB,
      `${mockUid}/journal/notes`
    )
    expect(getDocs).toHaveBeenCalled()
    expect(result).toEqual([mockNote])
  })

  it("should throw an error when uid is not provided", async () => {
    await expect(loadNotes()).rejects.toThrow("El UID del usuario no existe")
  })
})
