import React from "react"
import { AppRouter } from "./router/index"
import { AppTheme } from "./theme"

export const JournalApp = () => {
  return (
    <>
      <AppTheme>
        <AppRouter />
      </AppTheme>
    </>
  )
}
