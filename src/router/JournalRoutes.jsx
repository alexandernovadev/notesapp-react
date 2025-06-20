import { Route, Routes, Navigate } from "react-router-dom"
import JournalPage from "../atomic/pages/pg-journal"
import OrNoteView from "../atomic/organisms/or-noteview"
import TmDashlayout from "../atomic/templates/tm-dashlayout"

const JournalRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<JournalPage />} />
      <Route path="addnote/:id?" element={<OrNoteView />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default JournalRoutes
