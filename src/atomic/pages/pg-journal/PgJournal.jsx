import TmDashlayout from "../../templates/tm-dashlayout"
import MlAddEntry from "../../molecules/ml-addentry"
import OrNoSelected from "../../organisms/or-noselected"
import OrNoteView from "../../organisms/or-noteview"

import { startNewNote } from "../../../store/journal/thunks"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"

const PgJournal = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isSaving, active } = useSelector((state) => state.journal)

  const onClickNewNote = () => {
    dispatch(startNewNote())
    navigate("/addnote")
  }

  return (
    <TmDashlayout>
      {!!active ? <OrNoteView /> : <OrNoSelected />}

      <MlAddEntry
        onClick={onClickNewNote}
        size="large"
        disabled={isSaving}
        sx={{
          color: "white",
          backgroundColor: "error.main",
          ":hover": { backgroundColor: "error.main", opacity: 0.9 },
          position: "fixed",
          right: 50,
          bottom: 50,
        }}
      />
    </TmDashlayout>
  )
}

export default PgJournal
