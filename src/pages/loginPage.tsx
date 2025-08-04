import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";
import "../assets/fonts/Alef-Regular.ttf";
import "../style/login.css";
import { Box, Button, TextField, Typography } from "@mui/material";

const LoginPage = () => {
  const { t } = useTranslation();
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUsername } = useUser();

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", username);
      setUsername(username);
      navigate("/reviewFlights");
    } else {
      alert(t("wrongLogin"));
    }
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleLogin}
      sx={{
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        m: "auto",
        mt: "10vh",
        maxWidth: "22vw",
        borderRadius: 3,
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)"
      }}
    >
      <Typography sx={{ fontSize: "2rem", m: 2, mb: 4, fontWeight: "bold" }} component="h2">
        {t("login")}
      </Typography>
      <TextField
        sx={{
          mb: 2,
          borderRadius: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3, 
          },
          width: "17vw"
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
          width: "17vw"
        }}
        placeholder={t("password")}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      ></TextField>
      <Button sx={{ bgcolor: "#6499ff", color: "#ffffff", width: "17vw", borderRadius: 3, mb: 2 }} type="submit">
        {t("connect")}
      </Button>
    </Box>
  );
};

export default LoginPage;
