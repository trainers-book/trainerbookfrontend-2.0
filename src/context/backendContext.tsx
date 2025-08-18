import { createContext, useContext, useState } from "react";

class Connection {
  async login(username: string, password: string) {
    try {
        const response = await fetch("http://localhost:3002/Authentication/" + username + "/" + password);
        const data = await response.json();
        return data[0];
    } catch (error) {
        // console.log(error);
        return "unexpected error";
    }
    
    //   .then((data) => {
        // if (data != 404) loginSuccess(data[0];
        // return isNaN(data) ? data[0] : null;
    //   })
    //   .catch((error) => {
        // alert("error: " + error);
    //   });
  }

  async getAllPlatforms() {
    try {
        const response = await fetch("http://localhost:3002/Aircraft");
        const data = await response.json();
        return data;
    } catch (error) {
        // console.log(error);
        return "unexpected error";
    }
    
    //   .then((data) => {
        // if (data != 404) loginSuccess(data[0];
        // return isNaN(data) ? data[0] : null;
    //   })
    //   .catch((error) => {
        // alert("error: " + error);
    //   });
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
