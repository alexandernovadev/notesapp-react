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
import MenuIcon from "@mui/icons-material/Menu"

import { useDispatch, useSelector } from "react-redux"
import { startLogout } from "../../../store/auth/thunks"
import { setActiveNote } from "../../../store/journal/JournalSlice"

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
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "auto",
        backgroundColor: "primary.light",
      }}
      className="animate__animated animate__fadeIn"
    >
      <MlNavBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <AtBox component="main" sx={{ flexGrow: 1, p: 2, height: "100vh" }}>
        <AtBox
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            backgroundColor: "primary.light",
            pb: 1,
          }}
        >
          <AtGrid container justifyContent="space-between" alignItems="center">
            <AtGrid display="flex" alignItems="center" gap={1}>
              <AtButton
                variant="text"
                onClick={() => setIsOpen(true)}
                sx={{ minWidth: 0, p: 1 }}
              >
                <MenuIcon />
              </AtButton>
              <AtButton
                variant="text"
                onClick={() => {
                  dispatch(setActiveNote(null))
                  navigate("/")
                }}
              >
                <NoteIcon /> &nbsp; Mis Notas
              </AtButton>
            </AtGrid>

            <AtGrid display="flex" gap={2}>
              <AtTypography sx={{ pt: 1 }}>
                {displayName || "Usuario"}
              </AtTypography>
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
                  <MenuItem
                    onClick={() => {
                      setIsAvatarMenuOpen(false)
                      navigate("/profile")
                    }}
                  >
                    <AccountCircleIcon />
                    &nbsp; Profile
                  </MenuItem>
                  <MenuItem
                    divider
                    onClick={() => {
                      setIsAvatarMenuOpen(false)
                      navigate("/myaccount")
                    }}
                  >
                    <Person3Icon />
                    &nbsp; My account
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setIsAvatarMenuOpen(false)
                      navigate("/aboutme")
                    }}
                  >
                    <Person3Icon />
                    &nbsp; Sobre mí
                  </MenuItem>
                  <MenuItem onClick={handleLogOut}>
                    <LogoutIcon />
                    &nbsp; Logout
                  </MenuItem>
                </MenuList>
              </Popover>
            </AtGrid>
          </AtGrid>
        </AtBox>
        <AtBox sx={{ pt: 4, pb: 3 }}>{children}</AtBox>
      </AtBox>
    </AtBox>
  )
}

export default TmDashlayout
