import { createContext, useContext, useState } from "react";

class LocalStorage {
  encoder: TextEncoder;
  decoder: TextDecoder;

  constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }

  encodeString(toEncode: string) {
    return btoa(unescape(encodeURIComponent(toEncode)));
  }

  decodeString(toDecode: string | null) {
    return toDecode ? decodeURIComponent(escape(atob(toDecode))) : null;
  }

  getValue(key: string) {
    const localstorageProblem = () => {
      // probably not the best to be in prod. suggestions are welcome for the prod verion.
      // and it doesnt work for all changes to the localstorage
      console.log("problem with decoding localstorage. reseting all values");
      // and might need to redirect to login page
      localStorage.clear();
    };

    const value = localStorage.getItem(this.encodeString(key));
    if (!value) {
      localstorageProblem();
    }

    try {
      let decoded = this.decodeString(value);

      return value ? decoded : null;
    } catch (err) {
      localstorageProblem();
      return null;
    }
  }

  getAuthData() {
    const authDataKey = "authorization"; 
    const storedAuthData = this.getValue(authDataKey);
    const values = storedAuthData ? storedAuthData.split(",") : null;
    return values ? values[0] : null;
  }

  setValue(key: string, value: string) {
    localStorage.setItem(this.encodeString(key), this.encodeString(value));
  }

  deleteValue(key: string) {
    localStorage.removeItem(this.encodeString(key));
  }
}

interface LocalStorageContextType {
  ls: LocalStorage;
}

const LocalStorageContext = createContext<LocalStorageContextType | null>(null);

export const LocalStorageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ls, setLocalStorage] = useState(new LocalStorage());

  return (
    <LocalStorageContext.Provider value={{ ls }}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (!context)
    throw new Error(
      "useLocalStorage must be used within a LocalStorageProvider"
    );
  return context;
};
