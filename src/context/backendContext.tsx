import { createContext, useContext, useState } from "react";
import axios from "axios";

class Connection {
  appUrl: string;

  constructor() {
    this.appUrl = `http://${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/`;
  }

  async login(username: string, password: string) {
    return axios
      .get(`${this.appUrl}${API_Pathes.AUTHENTICATION}/${username}/${password}`)
      .then((response) => {
        return { status: response.status, data: response.data[0] };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data[0] };
      });
  }

  async getUserHasPassword(username: string) {
    return axios
      .get(`${this.appUrl}${API_Pathes.AUTHENTICATION}/${username}`)
      .then((response) => {
        return { status: response.status, data: response.data[0] };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data[0] };
      });
  }

  async setPassword(username: string, password: string) {
    return axios
      .put(`${this.appUrl}${API_Pathes.SET_PASSWORD}`, {
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
    return axios
      .get(`${this.appUrl}${collectionName}`)
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data };
      });
  }

  async addEntity(dbEntity: any, collection: string) {
    return axios
      .post(`${this.appUrl}${collection}`, dbEntity)
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data };
      });
  }

  async getUserbyPersonalNumber(personalNumber: string) {
    return axios
      .get(`${this.appUrl}${API_Pathes.GET_USER}/${personalNumber}`)
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data };
      });
  }

  async updateEntity(
    collectionName: string,
    object: any,
    fieldsToRemove = null,
  ) {
    return axios
      .put(`${this.appUrl}${collectionName}`, object, {
        headers: { fieldsToRemove: JSON.stringify(fieldsToRemove) },
      })
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data };
      });
  }

  async updateAccount(collectionName: string, object: any) {
    return axios
      .put(`${this.appUrl}Authentication/${collectionName}`, object)
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data };
      });
  }

  async updateAccountRole(
    collectionNameFrom: string,
    collectionNameTo: string,
    object: any,
  ) {
    return axios
      .put(
        `${this.appUrl}Authentication/${collectionNameFrom}/${collectionNameTo}`,
        object,
      )
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data };
      });
  }

  async getNextId(collection: string) {
    return axios
      .get(`${this.appUrl}${API_Pathes.GET_NEXT_ID}/${collection}`)
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data };
      });
  }

  async deleteObject(collection: string, id: string) {
    return axios
      .delete(`${this.appUrl}${collection}`, { params: { _id: id } })
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data };
      });
  }

  async getManageTabs(authenticationLevel: string) {
    return axios
      .post(`${this.appUrl}${API_Pathes.MANAGE}`, { role: authenticationLevel })
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data };
      });
  }

  async getObjects(collection: string, index: number, platform: string[]) {
    platform = JSON.stringify(
      platform.map((platformName) => {
        return { name: platformName };
      }),
    );
    return axios
      .get(`${this.appUrl}${collection}/Amount/${index}`, {
        params: { platform: platform },
      })
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data[0] };
      });
  }

  async getObjectsFilter(
    collection: string,
    index: number,
    platform: string[],
    filters: any,
  ) {
    // filter: {
    //   date: undefined,
    //   minDate: undefined,
    //   maxDate: undefined,
    //   failureStatus: undefined,
    //   issueSeverity: undefined,
    //   search: undefined
    // }
    return axios
      .get(`${this.appUrl}${collection}/getAmountByFilters/${index}`, {
        params: {
          platform: platform.map((platformName) =>
            JSON.stringify(platformName),
          ),
          filters: filters,
        },
      })
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return error;
      });
  }

  async getFlightMalfs(platform: string, ids: number[]) {
    return axios
      .get(`${this.appUrl}flightRelatedMalfs/`, {
        params: { platform: platform, malfs: JSON.stringify(ids) },
      })
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return error;
      });
  }

  async addPlatformToShowFor(collection: string, object: any) {
    return axios
      .patch(`${this.appUrl}${collection}`, object)
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return { status: error.response.status, data: error.response.data };
      });
  }

  async getAllObjects(collection: string) {
    return axios
      .get(`${this.appUrl}${collection}`)
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return error;
      });
  }

  async getEntitiesByDate(collection: string, platforms: string[], dateRange: {minDate: Date, maxDate: Date}) {
    return axios
      .get(`${this.appUrl}${collection}/GetByDatesRange`, {
        params: {
          platform: platforms,
          dateRange: JSON.stringify(dateRange),
        },
      })
      .then((response) => {
        return { status: response.status, data: response.data };
      })
      .catch((error) => {
        return error;
      });
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

export enum API_Pathes {
  PLATFORM = "Aircraft",
  INSTRUCTOR = "Instructor",
  INSPECTOR_INSTRUCTOR = "InspectorInstructor",
  COMMANDER = "Commander",
  PILOT = "Pilot",
  NAVIGATOR = "Navigator",
  INSPECTOR = "Inspector",
  TRAINER = "Trainer",
  TECHNICIAN = "Technician",
  PRESERVED_FLIGHT_NAME = "PreservedFlightNames",
  AUTHENTICATION = "Authentication",
  SET_PASSWORD = "setPassword",
  GET_ENTITY_BUT_STRING = "FindEntityByString",
  GET_USER = "getUser",
  GET_NEXT_ID = "getNextId",
  MANAGE = "Manage",
  FLIGHT_FAILURE = "FlightFailure",
  PRESERVED_FLIGHTS = "PreservedFlights",
  NEW_FLIGHTS_FIELDS = "NewFlightFields",
}

export enum CollectionIds {
  PRESERVED_FLIGHT_NAME_ID = "PreservedFlightNameId",
  FLIGHT_ID = "FlightId",
  MALF_ID = "MalfunctionId",
  AIRCRAFT_ID = "AircraftId",
}
