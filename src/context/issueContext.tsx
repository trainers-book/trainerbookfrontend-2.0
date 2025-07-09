import { createContext, useContext, useState, useEffect } from "react";
import IssueData from "../types/tables/issues";
import { Status } from "../types/statuses";
import { Severity } from "../types/issuesSeverity";
import { platformTypes } from "../types/platformTypes";
import { useTranslation } from "react-i18next";

interface IssueContextType {
  issueData: IssueData[];
  setIssuesData: (issueData: IssueData[]) => void;
}

const IssueContext = createContext<IssueContextType | null>(null);

export const IssueProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const getTempData = () => {
    const temp: IssueData[] = [];
    const getStatus = () => {
      const enumKeys = Object.keys(Status).filter((key) => isNaN(Number(key)));
      const randomIndex = Math.floor(Math.random() * enumKeys.length);
      const randomKey = enumKeys[randomIndex];
      return Status[randomKey as keyof T];
    };
    const getSeverity = () => {
      const enumKeys = Object.keys(Severity).filter((key) =>
        isNaN(Number(key))
      );
      const randomIndex = Math.floor(Math.random() * enumKeys.length);
      const randomKey = enumKeys[randomIndex];
      return Severity[randomKey as keyof T];
    };
    const getDate = () => {
      const minDate = new Date('2023-01-01T00:00:00.000Z').getTime();
      const maxDate = new Date().getTime();
      const randomTimestamp = Math.floor(Math.random() * (maxDate - minDate + 1)) + minDate;
      const randomDate = new Date(randomTimestamp);      
      return randomDate;
    }
    platformTypes.forEach((platform, index) => {
      temp.push(
        new IssueData(
          getDate(),
          index * 2,
          "רגיל",
          "מדריכה 1",
          "אין",
          t(platform),
          getSeverity(),
          getStatus()
        )
      );
      temp.push(
        new IssueData(
          getDate(),
          index * 2 + 1,
          "רגיל",
          "מדריכה 1",
          "אין",
          t(platform),
          getSeverity(),
          getStatus()
        )
      );
    });
    return temp;
  };

  const [issueData, setIssuesData] = useState<IssueData[]>(getTempData());

  useEffect(() => {
    setIssuesData(getTempData());
  }, []);

  return (
    <IssueContext.Provider value={{ issueData, setIssuesData }}>
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
