import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  SvgIcon,
  MenuItem,
  Menu,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { routeItems } from "../../types/routeTypes";
import "../../i18n";
import "./navbar.css";
import "../../types/routeTypes";
import OfekUnit from "../../assets/OfekUnit.png";
import { useLocalStorage } from "../../context/localStorageContext";
import { usePlatforms } from "../../context/platformsContext";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { ls } = useLocalStorage();
  const navigate = useNavigate();
  const location = useLocation();
  const { username, setUsername } = useUser();
  const { setPlatforms } = usePlatforms();

  const isLogin = location.pathname == "/";
  const isTechnician = true; // placeholder for future premissions

  const handleLogout = () => {
    ls.delPlatforms();
    ls.delAuthorization();
    ls.delUserName();
    ls.delDisplayName();
    ls.delIsAuthenticated()

    setAnchorEl(null);
    setUsername("");
    setPlatforms([]);
    navigate("/");
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const possibleRoutes = routeItems.filter((route) => {return true;});

  return (
    !isLogin && (
      <Box sx={{ flexGrow: 1, mb: 2 }}>
        <AppBar
          sx={{ backgroundColor: "rgba(255, 255, 255, 1)", borderRadius: 5 }}
          position="static"
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                sx={{ maxHeight: 50, mt: 1, mb: 1, ml: 2 }}
                src={OfekUnit}
              />
              <Typography
                sx={{
                  color: "rgba(124, 124, 124, 1)",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                {t("trainerBook")}
              </Typography>
            </Box>
            <List
              sx={{
                background: "rgba(248, 248, 250, 1)",
                opacity: "70%",
                borderRadius: 2,
                mr: 2,
                display: "flex",
                flexDirection: "row",
              }}
              disablePadding
            >
              {possibleRoutes.map((key) => (
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      p: 0,
                      margin: 0.5,
                      color: "rgba(124, 124, 124, 1)",
                    }}
                    onClick={() => navigate("/" + key)}
                  >
                    <Typography
                      sx={{
                        borderRadius: 2,
                        p: 1,
                        pl: 4,
                        pr: 4,
                        fontWeight: "bold",
                      }}
                      align="center"
                      noWrap
                      className={
                        location.pathname.includes(key) ? "active-route" : ""
                      }
                    >
                      {t(key)}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List> 
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{ opacity: "70%", cursor: "pointer" }}
                  className="text"
                  onClick={handleClick}
                >
                  {!open && <ArrowDropDownIcon />}
                  {open && <ArrowDropUpIcon />}
                </Typography>
                <Typography
                  sx={{ opacity: "70%", cursor: "pointer" }}
                  className="text"
                  onClick={handleClick}
                >
                  {username}
                </Typography>
                {/* <Box component="img" src="https://mi/api/v1/people/image/s8852773"/> */}
                <Menu
                  sx={{ "& .MuiPaper-root": { background: "rgba(255, 255, 255, 1)" } }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    sx={{
                      "& .MuiPaper-root": { background: "rgba(255, 255, 255, 1)" },
                      ":focus": { background: "rgba(255, 255, 255, 1)" },
                      ":hover": { background: "rgba(255, 255, 255, 1)" },
                    }}
                  >
                    {t("hello")} {username}
                    <br></br>
                    {t("instructor")} {t("shoval")}
                  </MenuItem>
                  <hr></hr>
                  <MenuItem sx={{ color: "rgba(211, 47, 17, 1)" }} onClick={handleLogout}>
                    <SvgIcon sx={{ ml: 0.5 }} onClick={() => handleLogout()}>
                      <LogoutIcon />
                    </SvgIcon>
                    {t("logout")}
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    )
  );
};

export default Navbar;
