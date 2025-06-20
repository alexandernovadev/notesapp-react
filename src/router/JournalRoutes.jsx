import { Route, Routes, Navigate } from "react-router"
import JournalPage from "../atomic/pages/pg-journal"
import OrNoteView from "../atomic/organisms/or-noteview"
import TmDashlayout from "../atomic/templates/tm-dashlayout"
import PgProfile from "../atomic/pages/pg-profile"
import PgMyAccount from "../atomic/pages/pg-myaccount"
import PgAboutMe from '../atomic/pages/pg-aboutme'

const JournalRoutes = () => {
  return (
    <TmDashlayout>
      <Routes>
        <Route path="" element={<JournalPage />} />
        <Route path="addnote/:id?" element={<OrNoteView />} />
        <Route path="profile" element={<PgProfile />} />
        <Route path="myaccount" element={<PgMyAccount />} />
        <Route path="aboutme" element={<PgAboutMe />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </TmDashlayout>
  )
}

export default JournalRoutes
