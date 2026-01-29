import { createContext, useContext, useState } from "react";

class LocalStorage {
  encoder: TextEncoder;
  decoder: TextDecoder;
  platforms: string;
  authorization: string;
  userName: string;
  displayName: string;
  isAuthenticated: string;
  adminLogin: string;

  constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
    this.platforms = "platforms";
    this.authorization = "authorization";
    this.userName = "userName";
    this.displayName = "displayName";
    this.isAuthenticated = "isAuthenticated";
    this.adminLogin = "adminLogin"
  }

  encodeString(toEncode: string) {
    return btoa(unescape(encodeURIComponent(toEncode)));
  }

  decodeString(toDecode: string | null) {
    return toDecode ? decodeURIComponent(escape(atob(toDecode))) : null;
  }

  clear() {
    localStorage.clear();
  }

  getValue(key: string) {
    const localstorageProblem = () => {
      // probably not the best to be in prod. suggestions are welcome for the prod verion.
      // and it doesnt work for all changes to the localstorage
      console.log("problem with decoding localstorage. reseting all values");
      // and might need to redirect to login page
      this.clear();
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

  setValue(key: string, value: string) {
    localStorage.setItem(this.encodeString(key), this.encodeString(value));
  }

  deleteValue(key: string) {
    localStorage.removeItem(this.encodeString(key));
  }

  setPlatforms(platforms: string | string[]) {
    const userPlatforms = Array.isArray(platforms) ? platforms : [platforms];

    this.setValue(this.platforms, userPlatforms.join(","));
  }

  // TODO: we should to change it in the backend in order to get only one autherization, and here force to have only one
  setAuthorization(authorization: string | string[]) {
    const userAuthorization = Array.isArray(authorization)
      ? authorization[0]
      : authorization;

    this.setValue(this.authorization, userAuthorization);
  }

  setUserName(userName: string) {
    this.setValue(this.userName, userName);
  }

  setDisplayName(displayName: string) {
    this.setValue(this.displayName, displayName);
  }

  setIsAuthenticated(isAuthenticated: string) {
    this.setValue(this.isAuthenticated, isAuthenticated);
  }
  
  setAdminLogin(adminLoginDetails: any) {    
    this.setValue(this.adminLogin, JSON.stringify(adminLoginDetails));
  }

  getPlatforms() {
    return this.getValue(this.platforms)?.split(",");
  }

  getAuthorization() {
    return this.getValue(this.authorization);
  }

  getUserName() {
    return this.getValue(this.userName);
  }

  getDisplayName() {
    return this.getValue(this.displayName);
  }

  getIsAuthenticated() {
    return this.getValue(this.isAuthenticated);
  }
  
  getAdminLogin() {
    return this.getValue(this.adminLogin);
  }

  delPlatforms() {
    this.deleteValue(this.platforms);
  }

  delAuthorization() {
    this.deleteValue(this.authorization);
  }

  delUserName() {
    this.deleteValue(this.userName);
  }

  delDisplayName() {
    this.deleteValue(this.displayName);
  }

  delIsAuthenticated() {
    this.deleteValue(this.isAuthenticated);
  }
  
  delAdminLogin() {
    this.deleteValue(this.adminLogin);
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
