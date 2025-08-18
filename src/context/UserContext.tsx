import { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "./localStorageContext";

interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { ls } = useLocalStorage();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const stored = ls.getDisplayName();
    console.log(stored);
    
    
    if (stored) {

      setUsername(stored);
    }

  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
