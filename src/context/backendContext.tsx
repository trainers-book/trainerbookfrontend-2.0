import { createContext, useContext, useState } from "react";

class Connection {
  async login(username: string, password: string) {
    try {
        const response = await fetch("http://localhost:3002/Authentication/" + username + "/" + password);
        const data = await response.json();
        return data[0];
    } catch (error) {
        return "unexpected error";
    }
  }

  async getAllPlatforms() {
    try {
        const response = await fetch("http://localhost:3002/Aircraft");
        const data = await response.json();
        return data;
    } catch (error) {
        return "unexpected error";
    }
  }
  
  async getAllInspectors() {
    try {
        const response = await fetch("http://localhost:3002/Instructor");
        const data = await response.json();
        return data;
    } catch (error) {
        return "unexpected error";
    }
  }
  
  async getAllInspectorInstructor() {
    try {
        const response = await fetch("http://localhost:3002/InspectorInstructor");
        const data = await response.json();
        return data;
    } catch (error) {
        return "unexpected error";
    }
  }
  
  async getAllCommander() {
    try {
        const response = await fetch("http://localhost:3002/Commander");
        const data = await response.json();
        return data;
    } catch (error) {
        return "unexpected error";
    }
  }
  
  async getAllPilot() {
    try {
        const response = await fetch("http://localhost:3002/Pilot");
        const data = await response.json();
        return data;
    } catch (error) {
        return "unexpected error";
    }
  }
  
  async getAllNavigator() {
    try {
        const response = await fetch("http://localhost:3002/Navigator");
        const data = await response.json();
        return data;
    } catch (error) {
        return "unexpected error";
    }
  }
  
  async getAllInspector() {
    try {
        const response = await fetch("http://localhost:3002/Inspector");
        const data = await response.json();
        return data;
    } catch (error) {
        return "unexpected error";
    }
  }
  
  async getAllTrainer() {
    try {
        const response = await fetch("http://localhost:3002/Trainer");
        const data = await response.json();
        return data;
    } catch (error) {
        return "unexpected error";
    }
  }
  
  async getAllTechnician() {
    try {
        const response = await fetch("http://localhost:3002/Technician");
        const data = await response.json();
        return data;
    } catch (error) {
        return "unexpected error";
    }
  }
  
  async getAllPreservedFlightNames() {
    try {
        const response = await fetch("http://localhost:3002/PreservedFlightNames");
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
    throw new Error(
      "useBackend must be used within a BackendProvider"
    );
  return context;
};
