import { createTheme } from "@mui/material"
import { red } from "@mui/material/colors"

export const purpleTheme = createTheme({
  palette: {
    primary: {
      main: "#06283D",
      light: "#ecf8fcfc",
      contrastText: "#fff",
    },
    secondary: {
      main: "#1363DF",
      contrastText: "#fff",
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
})
