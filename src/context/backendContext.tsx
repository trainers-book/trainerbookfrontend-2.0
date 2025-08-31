import { createContext, useContext, useState } from "react";
import axios from "axios";

class Connection {
  appUrl: string;

  constructor() {
    this.appUrl = `http://${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/`;
  }

  async login(username: string, password: string) {    
    return axios.get(`${this.appUrl}Authentication/${username}/${password}`).then(response => {return {status: response.status, data: response.data[0]}}).catch(error => {return {status: error.response.status, data: error.response.data[0]}});
  }
}

interface BackendContextType {
  connection: Connection;
}

const BackendContext = createContext<BackendContextType | null>(null);

export const BackendProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connection, setConnection] = useState(new Connection());

  return (
    <BackendContext.Provider value={{ connection }}>
      {children}
    </BackendContext.Provider>
  );
};

export const useBackend = () => {
  const context = useContext(BackendContext);
  if (!context)
    throw new Error(
      "useBackend must be used within a BackendProvider"
    );
  return context;
};
