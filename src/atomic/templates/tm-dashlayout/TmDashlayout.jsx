import { useState } from "react"
import { useNavigate } from "react-router"

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

import { useDispatch, useSelector } from "react-redux"
import { startLogout } from "../../../store/auth/thunks"

const TmDashlayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { displayName } = useSelector((state) => state.auth)

  const handleLogOut = () => {
    dispatch(startLogout())
  }

  // Función para obtener iniciales del displayName
  const getInitials = (name) => {
    if (!name) return "?"
    const names = name.trim().split(" ")
    if (names.length === 1) return names[0][0].toUpperCase()
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
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
            <AtTypography sx={{ pt: 1 }}>{displayName || "Usuario"}</AtTypography>
            <AtAvatar
              id="avatar-button"
              sx={{ width: 32, height: 32 }}
              onClick={() => setIsAvatarMenuOpen(true)}
            >
              {getInitials(displayName)}
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
                <MenuItem onClick={() => { setIsAvatarMenuOpen(false); navigate('/profile') }}>
                  <AccountCircleIcon />
                  &nbsp; Profile
                </MenuItem>
                <MenuItem divider onClick={() => { setIsAvatarMenuOpen(false); navigate('/myaccount') }}>
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
