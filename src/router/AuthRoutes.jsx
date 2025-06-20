import { Route, Routes, Navigate } from "react-router"

import PgLogin from "../atomic/pages/pg-login"
import PgRegister from "../atomic/pages/pg-register"

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<PgLogin />} />
      <Route path="register" element={<PgRegister />} />

      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  )
}
export default AuthRoutes
