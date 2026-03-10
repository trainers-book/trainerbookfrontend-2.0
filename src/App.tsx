import "./style/fonts.css";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import AppRoutes from "./router/Index";
import { UserProvider } from "./context/UserContext";
import PageWrapper from "./components/pageWrapper/PageWrapper";
import { LocalStorageProvider } from "./context/localStorageContext";
import { PlatformsProvider } from "./context/platformsContext";
import { PermitProvider } from "./context/permitContext";
import { BackendProvider } from "./context/backendContext";

function App() {
  return (
    <Router>
      <BackendProvider>
        <LocalStorageProvider>
          <UserProvider>
            <PlatformsProvider>
            <PermitProvider>
              <Navbar />
              <PageWrapper>
                <AppRoutes />
              </PageWrapper>
            </PermitProvider>
            </PlatformsProvider>
          </UserProvider>
        </LocalStorageProvider>
      </BackendProvider>
    </Router>
  );
}

export default App;
