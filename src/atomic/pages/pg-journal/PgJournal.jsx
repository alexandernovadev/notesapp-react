import MlAddEntry from "../../molecules/ml-addentry"
import OrNotes from "../../organisms/or-notes/OrNotes"

import { startNewNote } from "../../../store/journal/thunks"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"

const PgJournal = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isSaving } = useSelector((state) => state.journal)

  const onClickNewNote = () => {
    dispatch(startNewNote())
    navigate("/addnote")
  }

  return (
    <>
      <OrNotes />

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
    </>
  )
}

export default PgJournal
