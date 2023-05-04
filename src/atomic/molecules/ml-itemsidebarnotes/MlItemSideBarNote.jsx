import React, { useMemo } from "react"
import { useDispatch } from "react-redux"

import {capitalize} from "@mui/material"

import ListItemButton from "@mui/material/ListItemButton"
import AtGrid from "../../atoms/at-grid"
import AtTypography from "../../atoms/at-typography"

import { setActiveNote } from "../../../store/journal/JournalSlice"
import { getFormatDistanceToNow } from "../../../helpers/getFormatDistanceToNow"

const MlItemSideBarNote = ({ date, id, body, title, imageUrls, onClose }) => {
  const dispatch = useDispatch()

  
  const onClickNote = () => {
    dispatch(setActiveNote({ title, body, id, date }))
    onClose()
  }

  const titleCrop = useMemo(() => {
    return title.length > 19 ? title.substring(0, 17) + "..." : title
  }, [title])


  const descriptionCrop = useMemo(() => {
    return body.length > 79 ? body.substring(0, 80) + "..." : title
  }, [body])


  return (
    <ListItemButton
      sx={{ borderLeft: "2px dotted gray ", my: 2 }}
      onClick={onClickNote}
    >
      <AtGrid container direction="column" justifyContent="start">
        <AtTypography variant="h6">{capitalize(titleCrop)}</AtTypography>
        <AtTypography variant="body" component="h6" sx={{ p: 1 }}>
          {descriptionCrop}
        </AtTypography>
        <AtGrid container direction="row" justifyContent="end">
          <AtTypography variant="body2" sx={{ color: "gray" }}>
            {getFormatDistanceToNow(date)}
          </AtTypography>
        </AtGrid>
      </AtGrid>
    </ListItemButton>
  )
}

export default MlItemSideBarNote
