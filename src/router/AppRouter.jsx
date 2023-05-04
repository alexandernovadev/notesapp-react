import { Route, Routes, Navigate } from "react-router-dom"
import AuthRoutes from "./AuthRoutes"
import { useCheckAuth } from "../hooks/useCheckAuth"
import JournalRoutes from "./JournalRoutes"
import TmLoadingLayout from "../atomic/templates/tm-loadinglayout"

const AppRouter = () => {
  const status = useCheckAuth()

  if (status === "checking") return <TmLoadingLayout />

  return (
    <Routes>
      {status === "authenticated" ? (
        <Route path="/*" element={<JournalRoutes />} />
      ) : (
        <Route path="/auth/*" element={<AuthRoutes />} />
      )}

      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  )
}

export default AppRouter
