import { useState } from "react"

import MenuItem from "@mui/material/MenuItem"
import MenuList from "@mui/material/MenuList"
import Popover from "@mui/material/Popover"
import NoteIcon from "@mui/icons-material/Note"
import LogoutIcon from "@mui/icons-material/Logout"
import Person3Icon from "@mui/icons-material/Person3"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import AtBox from "../../atoms/at-box"
import AtAvatar from "../../atoms/at-avatar"
import AtButton from "../../atoms/at-button"
import MlNavBar from "../../molecules/ml-navbar"
import AtGrid from "../../atoms/at-grid/AtGrid"
import AtTypography from "../../atoms/at-typography/AtTypography"

import { useDispatch } from "react-redux"
import { startLogout } from "../../../store/auth/thunks"

const TmDashlayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)

  const dispatch = useDispatch()

  const handleLogOut = () => {
    dispatch(startLogout())
  }

  return (
    <AtBox
      sx={{ display: "flex", backgroundColor: "primary.light" }}
      className="animate__animated animate__fadeIn"
    >
      <MlNavBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <AtBox component="main" sx={{ flexGrow: 1, p: 2, height: "100vh" }}>
        <AtGrid container justifyContent="space-between">
          <AtButton variant="text" onClick={() => setIsOpen(!isOpen)}>
            <NoteIcon /> &nbsp; Mis Notas
          </AtButton>

          <AtGrid display="flex" gap={2}>
            <AtTypography sx={{ pt: 1 }}>Alexander Nova</AtTypography>
            <AtAvatar
              id="avatar-button"
              sx={{ width: 32, height: 32 }}
              onClick={() => setIsAvatarMenuOpen(true)}
            >
              AN
            </AtAvatar>
            <Popover
              open={isAvatarMenuOpen}
              onClose={() => setIsAvatarMenuOpen(false)}
              anchorEl={document.querySelector("#avatar-button")}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuList>
                <MenuItem>
                  <AccountCircleIcon />
                  &nbsp; Profile
                </MenuItem>
                <MenuItem divider>
                  <Person3Icon />
                  &nbsp; My account
                </MenuItem>
                <MenuItem onClick={handleLogOut}>
                  <LogoutIcon />
                  &nbsp; Logout
                </MenuItem>
              </MenuList>
            </Popover>
          </AtGrid>
        </AtGrid>

        <AtBox sx={{ pt: 4 }}>{children}</AtBox>
      </AtBox>
    </AtBox>
  )
}

export default TmDashlayout
