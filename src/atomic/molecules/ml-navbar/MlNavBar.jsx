import React from "react"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft"

import AtGrid from "../../atoms/at-grid"
import AtBox from "../../atoms/at-box"
import AtDivider from "../../atoms/at-divider"
import AtTypography from "../../atoms/at-typography"
import noteLogo from "../../../assets/notesIcon.png"
import MlItemSideBarNote from "../../molecules/ml-itemsidebarnotes"
import MoodBadIcon from "@mui/icons-material/MoodBad"

import { useSelector } from "react-redux"

const drawerWidth = 280

const MlNavBar = ({ isOpen, onClose }) => {
  const { notes } = useSelector((state) => state.journal)

  return (
    <SwipeableDrawer open={isOpen} onClose={onClose} onOpen={() => {}}>
      <AtBox
        sx={{
          width: drawerWidth,
          height: "100vh",
          py: 2,
          px: 1,
          backgroundColor: "primary.main",
          color: "white",
        }}
      >
        <AtGrid
          container
          direction="row"
          justifyContent="center"
          sx={{ py: 2 }}
        >
          <img src={noteLogo} alt="Notes Icon" width={50} />
          <AtTypography variant="h4" sx={{ px: 2 }}>
            NotesApp
          </AtTypography>
        </AtGrid>
        <AtDivider sx={{ backgroundColor: "white" }} />

        <AtBox sx={{ height: "82vh", py: 3, overflow: "auto" }}>
          {notes.length == 0 ? (
            <AtGrid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ pt: 20 }}
            >
              <MoodBadIcon />
              <AtTypography variant="h4" sx={{ textAlign: "center" }}>
                Sin Notas
              </AtTypography>
            </AtGrid>
          ) : (
            <>
              {notes?.map((note) => (
                <MlItemSideBarNote {...note} key={note.id} onclose={onClose} />
              ))}
            </>
          )}
        </AtBox>
        <AtGrid container direction="row" justifyContent="end">
          <KeyboardDoubleArrowLeftIcon
            data-testid="close-icon"
            onClick={onClose}
          />
        </AtGrid>
      </AtBox>
    </SwipeableDrawer>
  )
}

export default MlNavBar
