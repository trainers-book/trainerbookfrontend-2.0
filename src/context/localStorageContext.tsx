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

  decodeString(toDecode: string) {
    return decodeURIComponent(escape(atob(toDecode)));
  }

  getValue(key: string) {
    const value = localStorage.getItem(this.encodeString(key));
    console.log(this.decodeString(value));
    
    return value ? this.decodeString(value) : null;
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

export const LocalStorageProvider = ({ children }: { children: React.ReactNode }) => {
  const [ls, setLocalStorage] = useState(new LocalStorage());

  return (
    <LocalStorageContext.Provider value={{ ls }}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (!context) throw new Error("useLocalStorage must be used within a LocalStorageProvider");
  return context;
};
