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
  const [wrongUser, setWrongUser] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const navigate = useNavigate();
  const { setUsername } = useUser();
  const { setPlatforms } = usePlatforms();
  const { connection } = useBackend();


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

  const loginError = () => {
    // setUsername("");
    // setPassword("");
    // setWrongUser(true);
    // setWrongPass(true);
  }

  const handleLogin = async (event: any) => {    
    event.preventDefault();
    if (username == "" || password == "") {
      setWrongUser(username == "");
      setWrongPass(password == "");
      return;
    }

    const loginResponse = await connection.login(username, password);    
    
    if (typeof loginResponse == "string") {
      if (loginResponse == "no user") {
        setWrongUser(true);
      } else if (loginResponse == "incorrect") {
        setWrongPass(true);
      } else if (loginResponse == "no password") {
        alert("ask li-am to create a new user for you. \nand also ask him why does he write his name with ע and not א, beacause it's very weird");
      } else {
        console.log(loginResponse);
        
      }
    } else {      
      loginSuccess(loginResponse);
    }
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
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
        pr: 2,
        pl: 2,
      }}
    >
      <Typography sx={{ fontSize: "2rem", m: 2, mb: 4, fontWeight: "bold" }}>
        {t("login")}
      </Typography>
      <TextField
        error={wrongUser}
        sx={{
          mb: 2,
          borderRadius: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
          },
          width: "17vw",
        }}
        placeholder={t("userName")}
        onChange={(e) => {setUsernameInput(e.target.value); setWrongUser(false);}}
      ></TextField>
      <TextField
        error={wrongPass}
        sx={{
          mb: 2,
          borderRadius: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
          },
          width: "17vw",
        }}
        placeholder={t("password")}
        onChange={(e) => {setPassword(e.target.value); setWrongPass(false);}}
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
