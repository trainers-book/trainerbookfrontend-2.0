import { createContext, useContext, useState } from "react";

class Connection {
  async login(username: string, password: string) {
    try {
      const response = await fetch(
        "http://localhost:3002/Authentication/" + username + "/" + password
      );
      const data = await response.json();
      return data[0];
    } catch (error) {
      return "unexpected error";
    }
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
