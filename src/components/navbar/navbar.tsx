import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  SvgIcon,
  IconButton,
  Badge,
  MenuItem,
  Menu,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { useEffect, useState } from "react";
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
  const { t, i18n } = useTranslation();
  const { ls } = useLocalStorage();
  const navigate = useNavigate();
  const location = useLocation();

  const { username, setUsername } = useUser();
  const { setPlatforms } = usePlatforms();

  const [isHover, setIsHover] = useState(false);

  const isLogin = location.pathname == "/";
  const isTechnician = true; // placeholder for future premissions
  const notificationsCount = 2;

  const handleLogout = () => {
    ls.deleteValue("isAuthenticated");
    ls.deleteValue("userName");
    ls.deleteValue("platforms");
    ls.deleteValue("authorization");
    ls.deleteValue("displayName");

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

  const possibleRoutes = routeItems.filter((route) => {
    return route != "usersManagment";
  }); // for future permissions
  // const possibleRoutes = routeItems.filter((route) => {return true;}); // for future permissions

  return (
    !isLogin && (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          sx={{ backgroundColor: "#ffffff", borderRadius: 5 }}
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
                  color: "#7c7c7c",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                {t("trainerBook")}
              </Typography>
            </Box>
            <List
              sx={{
                background: "#f8f8fa",
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
                      color: "#7c7c7c",
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
                  sx={{ "& .MuiPaper-root": { background: "#ffffff" } }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    sx={{
                      "& .MuiPaper-root": { background: "#ffffff" },
                      ":focus": { background: "#ffffff" },
                      ":hover": { background: "#ffffff" },
                    }}
                  >
                    {t("hello")} {username}
                    <br></br>
                    {t("instructor")} {t("shoval")}
                  </MenuItem>
                  <hr></hr>
                  <MenuItem sx={{ color: "#d32f11" }} onClick={handleLogout}>
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
