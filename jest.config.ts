import type { Config } from 'jest'
import path from 'path'

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFiles: ["./jest.setup.js"],
  transformIgnorePatterns: [],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "^@/(.*)$": path.resolve(__dirname, "src/$1"),
          "^@/components/(.*)$": path.resolve(__dirname, "src/components/$1"),
    "^@/hooks/(.*)$": path.resolve(__dirname, "src/hooks/$1"),
    "^@/store/(.*)$": path.resolve(__dirname, "src/store/$1"),
    "^@/helpers/(.*)$": path.resolve(__dirname, "src/helpers/$1"),
    "^@/firebase/(.*)$": path.resolve(__dirname, "src/firebase/$1"),
    "^@/theme/(.*)$": path.resolve(__dirname, "src/theme/$1"),
    "^@/assets/(.*)$": path.resolve(__dirname, "src/assets/$1")
  },
  setupFilesAfterEnv: [
    "@testing-library/jest-dom",
    "./jest.setup.js"
  ],
  moduleFileExtensions: ["js", "mjs", "json", "jsx", "ts", "tsx", "node"],
  testMatch: [
    "**/__tests__/**/*.(ts|tsx|js)",
    "**/*.(test|spec).(ts|tsx|js)"
  ]
}

export default config 