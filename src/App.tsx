import "./style/fonts.css";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import AppRoutes from "./router/Index";
import { UserProvider } from "./context/UserContext";
import PageWrapper from "./components/pageWrapper/PageWrapper";
import { IssueProvider } from "./context/issueContext";

function App() {
  return (
    <Router>
      <UserProvider>
        <IssueProvider>
          <Navbar />
          <PageWrapper>
            <AppRoutes />
          </PageWrapper>
        </IssueProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
