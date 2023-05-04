import React from "react"
import { AddOutlined } from "@mui/icons-material"
import AtIconButton from '../../atoms/at-iconbutton'

const MlAddEntry = ({ onClick, ...props }) => {
  return (
    <AtIconButton onClick={onClick} {...props}>
      <AddOutlined sx={{ fontSize: 30 }} />
    </AtIconButton>
  )
}

export default MlAddEntry
