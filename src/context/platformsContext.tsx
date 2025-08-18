import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "./localStorageContext";

interface PlatformsContextType {
  platforms: string[];
  setPlatforms: (platforms: string[]) => void;
}

const PlatformsContext = createContext<PlatformsContextType | null>(null);

export const PlatformsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { ls } = useLocalStorage();
  const [platforms, setPlatforms] = useState<string[]>([]);

  useEffect(() => {
    const stored = ls.getPlatforms();

    if (stored) {
      setPlatforms(stored.split(","));
    }
  }, []);

  return (
    <PlatformsContext.Provider value={{ platforms, setPlatforms }}>
      {children}
    </PlatformsContext.Provider>
  );
};

export const usePlatforms = () => {
  const context = useContext(PlatformsContext);
  if (!context)
    throw new Error("usePlatforms must be used within a PlatformsProvider");
  return context;
};
