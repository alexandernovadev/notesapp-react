import { Route, Routes, Navigate } from "react-router"
import JournalPage from "../atomic/pages/pg-journal"
import OrNoteView from "../atomic/organisms/or-noteview"
import TmDashlayout from "../atomic/templates/tm-dashlayout"
import PgProfile from "../atomic/pages/pg-profile"
import PgMyAccount from "../atomic/pages/pg-myaccount"

const JournalRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<JournalPage />} />
      <Route path="addnote/:id?" element={<OrNoteView />} />
      <Route path="profile" element={<PgProfile />} />
      <Route path="myaccount" element={<PgMyAccount />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default JournalRoutes
