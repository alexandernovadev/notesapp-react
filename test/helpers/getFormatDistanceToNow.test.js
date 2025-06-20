import { getFormatDistanceToNow } from "../../src/helpers/getFormatDistanceToNow"

describe("getFormatDistanceToNow Helper", () => {
  it("returns the correct distance to now in Spanish", () => {
    const date = new Date(2023, 4, 1, 12, 0, 0) // May 1, 2023 12:00:00
    const expectedOutput = "hace 3 días"
    const result = getFormatDistanceToNow(date)
    expect(result).toEqual(expectedOutput)
  })

  it("returns the correct distance to now for a future date", () => {
    const date = new Date(2023, 5, 1, 12, 0, 0) // June 1, 2023 12:00:00
    const expectedOutput = "hace 28 días"
    const result = getFormatDistanceToNow(date)
    expect(result).toEqual(expectedOutput)
  })
})
