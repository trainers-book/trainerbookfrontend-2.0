import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";
import "../assets/fonts/Alef-Regular.ttf";
import "../style/login.css";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useLocalStorage } from "../context/localStorageContext";
import { usePlatforms } from "../context/platformsContext";
import { useBackend } from "../context/backendContext";
import { HttpStatusCode } from "axios";

type User = {
  userName: string;
  name: string;
  authenticationLevel: string;
  platform: string | string[];
};

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { ls } = useLocalStorage();
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [wrongUser, setWrongUser] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const [createPassword, setcreatePassword] = useState(false);
  const [noUser, setNoUser] = useState(false);
  const navigate = useNavigate();
  const { setUsername } = useUser();
  const { setPlatforms } = usePlatforms();
  const { connection } = useBackend();

  const storeUser = (user: User) => {
    const platforms = Array.isArray(user.platform)
      ? user.platform
      : [user.platform];
    ls.setPlatforms(platforms.join(","));
    ls.setAuthorization(user.authenticationLevel);
    ls.setUserName(user.userName);
    ls.setDisplayName(user.name);
    ls.setIsAuthenticated("true");
    setUsername(user.name);
    setPlatforms(platforms);
  };

  const handleLogin = async () => {
    if (username == "" || password == "") {
      setWrongUser(username == "");
      setWrongPass(password == "");
      return;
    }

    const loginResponse = await connection.login(username, password);

    if (loginResponse.status == HttpStatusCode.Accepted) {
      storeUser(loginResponse.data);
      navigate("/reviewFlights");
    } else if (loginResponse.status == HttpStatusCode.NotFound) {
      setWrongUser(true);
    } else if (loginResponse.status == HttpStatusCode.Unauthorized) {
      setWrongPass(true);
    } else if (loginResponse.status == HttpStatusCode.NoContent) {
      setPassword("");
      setcreatePassword(true);
    } else {
      console.log(loginResponse);
    }
  };

  const handleNewPassword = async () => {
    const newPassResponse = await connection.setPassword(username, password);

    if (newPassResponse.status == HttpStatusCode.Ok) {
      const loginResponse = await connection.login(username, password);
      storeUser(loginResponse.data);
      navigate("/reviewFlights");
    } else {
      alert(t("internalErrorTryAgain"));
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (username == "") {
      setWrongUser(true);
      return;
    } else if (!createPassword) {
      const passResponse = await connection.getUserHasPassword(username);
      
      if (passResponse.status == HttpStatusCode.NotFound) { 
        setNoUser(true);
        return;
      } else if (passResponse.status == HttpStatusCode.NoContent) {
        setcreatePassword(true);
        setWrongPass(false);
        setPassword("");
        return;
      }
    }

    if (password == "") {
      setWrongPass(true);
      return;
    }

    if (createPassword) {
      handleNewPassword();
    } else {
      handleLogin();
    }
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit}
      sx={{
        bgcolor: "rgba(255, 255, 255, 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        m: "auto",
        mt: "10vh",
        maxWidth: "22vw",
        borderRadius: 3,
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
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
        error={wrongUser}
        disabled={createPassword}
        placeholder={t("userName")}
        value={username}
        onChange={(e) => {
          setUsernameInput(e.target.value);
          setWrongUser(false);
          setcreatePassword(false);
          setNoUser(false);
        }}
      ></TextField>
      <TextField
        sx={{
          mb: 0.5,
          borderRadius: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
          },
          width: "17vw",
        }}
        error={wrongPass}
        placeholder={t("password")}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setWrongPass(false);
        }}
        type="password"
      ></TextField>
      {createPassword && (
        <Typography sx={{ fontSize: "0.7rem" }} color="primary">
          {t("enterYourNewPassword")}
        </Typography>
      )}
      {noUser && (
        <Typography sx={{ fontSize: "0.7rem" }} color="error">
          {t("thereIsNoUserAskYourCommander")}
        </Typography>
      )}
      <Button
        sx={{
          bgcolor: "rgba(100, 153, 255, 1)",
          color: "rgba(255, 255, 255, 1)",
          width: "17vw",
          borderRadius: 3,
          mt: 2,
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
