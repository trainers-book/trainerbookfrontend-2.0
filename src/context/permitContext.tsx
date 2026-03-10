import { createContext, useContext, useState, useEffect } from "react";
import PermitData from "../types/tables/permits";
import { PermitStatus } from "../types/statuses";
import { useTranslation } from "react-i18next";
import { usePlatforms } from "./platformsContext";

interface PermitContextType {
  permitData: PermitData[];
  setPermitsData: (permitData: PermitData[]) => void;
}

const PermitContext = createContext<PermitContextType | null>(null);

export const PermitProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { platforms } = usePlatforms();

  const getTempData = () => {
    const temp: PermitData[] = [];
    const getStatus = () => {
      const enumKeys = Object.keys(PermitStatus).filter((key) =>
        isNaN(Number(key))
      );
      const randomIndex = Math.floor(Math.random() * enumKeys.length);
      const randomKey = enumKeys[randomIndex];
      return PermitStatus[randomKey as keyof typeof PermitStatus];
    };
    const getDate = () => {
      const minDate = new Date("2023-01-01T00:00:00.000Z").getTime();
      const maxDate = new Date().getTime();
      const randomTimestamp =
        Math.floor(Math.random() * (maxDate - minDate + 1)) + minDate;
      const randomDate = new Date(randomTimestamp);
      return randomDate;
    };
    platforms.forEach((platform) => {
      temp.push(
        new PermitData(
          getDate(),
          t(platform),
          "בול לא עובד",
          "רגיל",
          "מתישהו",
          getDate(),
          "slave",
          getDate(),
          getStatus()
        )
      );
      temp.push(
        new PermitData(
          getDate(),
          t(platform),
          "בול לא עובד",
          "רגיל",
          "מתישהו",
          getDate(),
          "slave",
          getDate(),
          getStatus()
        )
      );
      temp.push(
        new PermitData(
          getDate(),
          t(platform),
          "בול לא עובד",
          "רגיל",
          "מתישהו",
          getDate(),
          "slave",
          getDate(),
          getStatus()
        )
      );
      temp.push(
        new PermitData(
          getDate(),
          t(platform),
          "בול לא עובד",
          "רגיל",
          "מתישהו",
          getDate(),
          "slave",
          getDate(),
          getStatus()
        )
      );
      temp.push(
        new PermitData(
          getDate(),
          t(platform),
          "בול לא עובד",
          "רגיל",
          "מתישהו",
          getDate(),
          "slave",
          getDate(),
          getStatus()
        )
      );
    });
    return temp;
  };

  const [permitData, setPermitsData] = useState<PermitData[]>(getTempData());

  useEffect(() => {
    setPermitsData(getTempData());
  }, [platforms]);

  return (
    <PermitContext.Provider value={{ permitData, setPermitsData }}>
      {children}
    </PermitContext.Provider>
  );
};

export const usePermits = () => {
  const context = useContext(PermitContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
