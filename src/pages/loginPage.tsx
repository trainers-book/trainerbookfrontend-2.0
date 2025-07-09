import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../assets/fonts/Alef-Regular.ttf";
import "../style/login.css";

const LoginPage = () => {
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
      alert("שם משתמש או סיסמה שגויים");
    }
  };

  return (
    <div className="login-container">
      <h2>התחברות</h2>
      <input
        type="text"
        placeholder="שם משתמש"
        value={username}
        onChange={(e) => setUsernameInput(e.target.value)}
      />
      <input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>התחבר</button>
    </div>
  );
};

export default LoginPage;
