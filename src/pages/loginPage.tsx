import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";
import "../assets/fonts/Alef-Regular.ttf";
import "../style/login.css";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useLocalStorage } from "../context/localStorageContext";
import { usePlatforms } from "../context/platformsContext";

type User = {
  userName: string,
  name: string,
  authenticationLevel: string,
  platform: string | string[],
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { ls } = useLocalStorage();
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUsername } = useUser();
  const { setPlatforms } = usePlatforms();

  const loginSuccess = (user: User) => {
    const platforms = Array.isArray(user.platform) ? user.platform : [user.platform];
    ls.setPlatforms(platforms.join(","));
    ls.setAuthorization(user.authenticationLevel);
    ls.setUserName(user.userName);
    ls.setDisplayName(user.name);
    ls.setIsAuthenticated("true");
    setUsername(user.name);
    setPlatforms(platforms);
    navigate("/reviewFlights");
  };

  const handleLogin = (event) => {
    event.preventDefault();
    fetch("http://localhost:3002/Authentication/" + username + "/" + password)
      .then((res) => res.json())
      .then((data) => {
        if (data != 404) loginSuccess(data[0]);
      })
      .catch((error) => {
        alert("error: " + error);
      });
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleLogin}
      sx={{
        bgcolor: "rgba(255, 255, 255, 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        m: "auto",
        mt: "10vh",
        maxWidth: "22vw",
        borderRadius: 3,
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
        pr: 2,
        pl: 2,
      }}
    >
      <Typography sx={{ fontSize: "2rem", m: 2, mb: 4, fontWeight: "bold" }}>
        {t("login")}
      </Typography>
      <TextField
        sx={{
          mb: 2,
          borderRadius: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
          },
          width: "17vw",
        }}
        placeholder={t("userName")}
        onChange={(e) => setUsernameInput(e.target.value)}
      ></TextField>
      <TextField
        sx={{
          mb: 2,
          borderRadius: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
          },
          width: "17vw",
        }}
        placeholder={t("password")}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      ></TextField>
      <Button
        sx={{
          bgcolor: "rgba(100, 153, 255, 1)",
          color: "rgba(255, 255, 255, 1)",
          width: "17vw",
          borderRadius: 3,
          mb: 2,
        }}
        type="submit"
      >
        {t("connect")}
      </Button>
    </Box>
  );
};

export default LoginPage;
