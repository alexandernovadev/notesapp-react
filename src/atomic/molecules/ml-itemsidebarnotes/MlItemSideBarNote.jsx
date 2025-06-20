import React, { useMemo } from "react"
import { useDispatch } from "react-redux"
import { capitalize } from "@mui/material"
import ListItemButton from "@mui/material/ListItemButton"
import AtTypography from "../../atoms/at-typography"
import { setActiveNote } from "../../../store/journal/JournalSlice"

const MlItemSideBarNote = ({ date, id, body, title, imageUrls, onClose }) => {
  const dispatch = useDispatch()

  const onClickNote = () => {
    dispatch(setActiveNote({ title, body, id, date }))
    onClose()
  }

  const titleCrop = useMemo(() => {
    return title.length > 24 ? title.substring(0, 22) + "..." : title
  }, [title])

  return (
    <ListItemButton
      sx={{
        borderLeft: "3px solid #fff",
        my: 1,
        borderRadius: 2,
        background: "rgba(255,255,255,0.08)",
        transition: "background 0.2s, color 0.2s",
        ':hover': { background: "#fff", color: "#222" },
        px: 2,
        py: 1.5,
        minHeight: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClickNote}
    >
      <AtTypography variant="subtitle1" sx={{ fontWeight: 600, textAlign: 'center', width: '100%' }}>
        {capitalize(titleCrop) || 'Sin título'}
      </AtTypography>
    </ListItemButton>
  )
}

export default MlItemSideBarNote
