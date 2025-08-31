import { createContext, useContext, useState } from "react";
import axios from "axios";

class Connection {
  appUrl: string;

  constructor() {
    this.appUrl = `http://${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/`;
  }

  async login(username: string, password: string) {
    return axios
      .get(`${this.appUrl}Authentication/${username}/${password}`)
      .then((response) => {
        return { status: response.status, data: response.data[0] };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data[0] };
      });
  }

  async getUserHasPassword(username: string) {
    return axios
      .get(`${this.appUrl}Authentication/${username}`)
      .then((response) => {
        return { status: response.status, data: response.data[0] };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data[0] };
      });
  }

  async setPassword(username: string, password: string) {
    return axios
      .put(`${this.appUrl}setPassword`, {
        userInfo: [{ userName: username, password: password }],
      })
      .then((response) => {
        return { status: response.status, data: response.data[0] };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data[0] };
      });
  }

  async getAllEntities(collectionName: string) {
    try {
      const response = await fetch(`http://localhost:3002/${collectionName}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return "unexpected error";
    }
  }

  async addEntity(dbEntity: any, collection: string) {
    const messageBody = JSON.stringify(dbEntity);
    try {
      const response = await fetch(`http://localhost:3002/${collection}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: messageBody,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return "unexpected error";
    }
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
    throw new Error("useBackend must be used within a BackendProvider");
  return context;
};
