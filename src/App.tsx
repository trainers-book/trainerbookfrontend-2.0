import "./style/fonts.css";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import AppRoutes from "./router/Index";
import { UserProvider } from "./context/UserContext";
import PageWrapper from "./components/pageWrapper/PageWrapper";
import { IssueProvider } from "./context/issueContext";
import { LocalStorageProvider } from "./context/localStorageContext";
import { PlatformsProvider } from "./context/platformsContext";

function App() {
  return (
    <Router>
      <LocalStorageProvider>
        <UserProvider>
          <PlatformsProvider>
            <IssueProvider>
              <Navbar />
              <PageWrapper>
                <AppRoutes />
              </PageWrapper>
            </IssueProvider>
          </PlatformsProvider>
        </UserProvider>
      </LocalStorageProvider>
    </Router>
  );
}

export default App;
