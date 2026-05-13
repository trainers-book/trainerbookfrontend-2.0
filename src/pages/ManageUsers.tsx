import { useTranslation } from "react-i18next";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import GenericTable from "../components/table/table";
import {
  PreservedFlightNameData,
  ManageTypes,
  PlatformData,
  UsersAccountData,
  UsersData,
} from "../types/tables/manageTypes";
import { Box, SvgIcon, Button } from "@mui/material";
import { useEffect, useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import AccessibleIcon from "@mui/icons-material/Accessible";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import TrainIcon from "@mui/icons-material/Train";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import SideBar from "../components/sidebar/sidebar";
import NewUser from "../components/forms/newUserForm";
import NewFlight from "../components/forms/newFlightForm";
import NewPlatform from "../components/Popup/newPlatform/newPlatform";
import FilterSearchBar from "../components/Dynamics/filterSearchBar";
import { useLocalStorage } from "../context/localStorageContext";
import FlightData from "../types/tables/flight";
import { API_Pathes, useBackend } from "../context/backendContext";
import { HttpStatusCode } from "axios";
import ManageEditModel from "../components/Popup/manageUser/manageEdit";

const sunglassesIcon: React.ReactNode = (
  <SvgIcon>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 12">
      <path
        d="M 5, 5 m -2, 0 a 2,2 0 1,0 12,0"
        fill="#000000"
        stroke="black"
        strokeWidth={1}
      />
      <path
        d="M 22, 5 m -2, 0 a 2,2 0 1,0 12,0"
        fill="#000000"
        stroke="black"
        strokeWidth={1}
      />
      <rect x="0.5" y="4" width="34" height="1.5" fill="#000000" />
    </svg>
  </SvgIcon>
);

type Tab = {
  show: boolean;
  label: string;
  icon: React.ReactNode;
  collection: string;
  deleteEntity: boolean;
  editEntity: boolean;
  addEntity: boolean;
  entityType: string;
  entityToDbEntity: (entity: PlatformData | UsersData | PreservedFlightNameData) => any;
  userable: boolean;
};

const sortingFunction = (
  currentValue: PlatformData | UsersData | PreservedFlightNameData,
  nextValue: PlatformData | UsersData | PreservedFlightNameData
): number => {
  if (
    currentValue instanceof PlatformData &&
    nextValue instanceof PlatformData
  ) {
    return Number(currentValue._id) - Number(nextValue._id);
  } else if (
    currentValue instanceof UsersData &&
    nextValue instanceof UsersData
  ) {
    return (
      Number(currentValue.personalNumber) - Number(nextValue.personalNumber)
    );
  } else if (
    currentValue instanceof PreservedFlightNameData &&
    nextValue instanceof PreservedFlightNameData
  ) {
    return nextValue.date.getTime() - currentValue.date.getTime();
  }

  return 1;
};

const entityToDbEntityFunction = (
  entity: PlatformData | UsersData | PreservedFlightNameData
) => {
  if (entity instanceof PlatformData) {
    return {
      _id: entity._id,
      name: entity.name,
    };
  } else if (entity instanceof UsersData) {
    return {
      _id: entity.personalNumber,
      firstName: entity.firstName,
      lastName: entity.lastName,
      platform: entity.platforms,
      name: entity.firstName + " " + entity.lastName,
    };
  } else if (entity instanceof PreservedFlightNameData) {
    return {
      _id: JSON.stringify(entity._id),
      name: entity.name,
      platform: entity.platform,
      date: entity.date.getTime(),
    };
  }
};

const nameToIcons: Record<string, React.ReactNode> = {
  platform: <AirplanemodeActiveIcon />,
  instructors: <SchoolIcon />,
  commanders: <KeyboardCommandKeyIcon />,
  airCrew1: sunglassesIcon,
  airCrew2: <MenuBookIcon />,
  trainees: <TrainIcon />,
  technicians: <AccessibleIcon />,
  flights: <AirplaneTicketIcon />,
};

const ManageUsers: React.FC = () => { 
  const { t } = useTranslation();
  const { connection } = useBackend();
  const { ls } = useLocalStorage();
  const [data, setData] = useState<any[]>([]);
  const [newData, setNewData] = useState<boolean>(false);
  const [editPopupObject, setEditPopupObject] = useState<any>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab>();
  const [search, setSearch] = useState<string>("");
  const [isNewPlatformOpen, setIsNewPlatformOpen] = useState(false);

  useEffect(() => {
    const fetchTabs = async () => {
      const role = ls.getAuthorization();
      const tabsFetch = await connection.getManageTabs(role ?? "");
      const mappedTabs: Tab[] = [];

      if (tabsFetch.status == HttpStatusCode.Ok) {
        tabsFetch.data.forEach(
          (tab: {
            _id: number;
            name: string;
            show: string[];
            collection: string;
            delete: string[];
            edit: string[];
            add: string[];
            type: string;
            userable: boolean;
          }) => {
            if (tab.show.includes(role ?? "")) {
              mappedTabs.push({
                label: tab.name,
                show: true,
                icon: nameToIcons[tab.name],
                collection: tab.collection,
                deleteEntity: tab.delete.includes(role ?? ""),
                editEntity: tab.edit.includes(role ?? ""),
                addEntity: tab.add.includes(role ?? ""),
                entityType: tab.type,
                entityToDbEntity: entityToDbEntityFunction,
                userable: tab.userable,
              });
            }
          }
        );
      }      

      setTabs(mappedTabs);
      setCurrentTab(mappedTabs[0]);
    };

    fetchTabs();
  }, []);

  const deleteEntity = async (row: any) => {
    let updateResponse;

    if (currentTab!.entityType == ManageTypes.FLIGHT) {
      updateResponse = await connection.deleteObject(
        currentTab!.collection,
        row["!id"]
      );
    } else if (currentTab!.entityType == ManageTypes.USERS) {
      updateResponse = await connection.deleteObject(
        currentTab!.collection,
        row.personalNumber
      );

      await connection.deleteObject(
        API_Pathes.AUTHENTICATION,
        row.personalNumber
      );
    }

    if (updateResponse?.status == HttpStatusCode.Ok) {
      setNewData(!newData);
    }
  };

  const editEntity = async (row: any) => {
    if (currentTab!.entityType == ManageTypes.USERS && currentTab!.userable) {
      const user = await connection.getUserbyPersonalNumber(row.personalNumber);

      if (
        user.status == HttpStatusCode.Accepted &&
        user.data.password != undefined
      ) {
        setEditPopupObject(
          new UsersAccountData(
            user.data.userName,
            row.firstName,
            row.lastName,
            user.data.platform,
            user.data.password,
            user.data.authenticationLevel,
            user.data["_id"]
          )
        );
      } else {
        setEditPopupObject(
          new UsersData(
            row.personalNumber,
            row.firstName,
            row.lastName,
            row.platforms.split(", ")
          )
        );
      }
    } else if (currentTab!.entityType == ManageTypes.PLATFORM) {
      setEditPopupObject(new PlatformData(row.name, row.id));
    } else if (currentTab!.entityType == ManageTypes.FLIGHT) {
      setEditPopupObject(
        new PreservedFlightNameData(row.date, row.name, row.platform, row["!id"])
      );
    } else {
      setEditPopupObject(
        new UsersData(
          row.personalNumber,
          row.firstName,
          row.lastName,
          row.platforms.split(", ")
        )
      );
    }
  };

  const dataManipulationFunction = (
    entity: 
    { _id: string; name: string } |
    { _id: string, firstName: string, lastName: string, platform: string[], name: string } |
    { _id: string, name: string, platform: string, date: number } |
    any
  ): any => {    
    if (currentTab!.entityType == ManageTypes.PLATFORM) {
      return new PlatformData(entity["name"], Number(entity["_id"]));
    } else if (currentTab!.entityType == ManageTypes.USERS) {
      return new UsersData(entity["_id"], entity["firstName"], entity["lastName"], entity["platform"].join(", "));
    } else if (currentTab!.entityType == ManageTypes.FLIGHT) {
      const flight = new PreservedFlightNameData(new Date(entity["date"]), entity["name"], entity["platform"], entity["_id"]);
      (flight as any)["!id"] = (flight as any)["_id"];
      delete (flight as any)["_id"];

      return flight;
    }
  };

  const fetchData = async (collection: string) => {
    const entities: { status: number; data: any } =
      await connection.getAllEntities(collection);

    if (entities.status == HttpStatusCode.Ok) {
      const formattedEntities: PlatformData[] | UsersData[] | PreservedFlightNameData[] = [];
      entities.data.forEach((entity: any) => {formattedEntities.push(dataManipulationFunction(entity))});      

      return formattedEntities;
    }
  };

  const addData = async (
    collection: string,
    entity: any,
    entityToDbEntity: (entity: any) => any
  ) => {
    const data: { status: number; data: any } = await connection.addEntity(
      entityToDbEntity(entity),
      collection
    );

    if (data.status == HttpStatusCode.Ok) {
      setNewData(!newData);
    }
  };

  const fetchServerData = () => {
    if (!currentTab) {
      return;
    }

    setData([]);

    fetchData(currentTab.collection).then((fetchedData) => {
      if (fetchedData) {
        setData(fetchedData);
      }
    });
  };

  const submitEntity = (entity: any) => {
    addData(currentTab!.collection, entity, entityToDbEntityFunction);
  };

  const getCurrentTabTableProperties = (): string[] => {
    if (currentTab!.entityType == ManageTypes.PLATFORM) {
      return Object.keys(new PlatformData(""));
    } else if (currentTab!.entityType == ManageTypes.USERS) {
      return Object.keys(new UsersData("", "", "", []));
    } else if (currentTab!.entityType == ManageTypes.FLIGHT) {
      return Object.keys(new PreservedFlightNameData(new Date(), "", "", 0));
    }

    return [];
  };

  useEffect(() => {
    fetchServerData();
  }, [currentTab]);

  useEffect(() => {
    fetchServerData();
  }, [newData]);

  return (
    currentTab && (
      <PageWrapper>
        <Box sx={{ display: "flex" }}>
          <SideBar
            titlesIcons={tabs}
            activeTab={currentTab}
            changeTab={(newtabLable) => {
              setCurrentTab(tabs.filter((tab) => tab.label == newtabLable)[0]);
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <FilterSearchBar
                label={t("search")}
                setSearch={setSearch}
                width="9rem"
                isReset={false}
              />
              {currentTab.addEntity &&
                currentTab!.entityType == ManageTypes.USERS && (
                  <NewUser callback={submitEntity} />
                )}
              {currentTab!.entityType == ManageTypes.FLIGHT && (
                <NewFlight callback={submitEntity} />
              )}
              {currentTab!.entityType == ManageTypes.PLATFORM && (
                <>
                  <Button
                    variant="contained"
                    onClick={() => setIsNewPlatformOpen(true)}
                    sx={{ background: "rgb(114,165,240)", mr: 1, mb: 1 }}
                  >{t("newPlatform")}</Button>
                  <NewPlatform open={isNewPlatformOpen} onClose={() => setIsNewPlatformOpen(closed)} callback={submitEntity} />
                </>
              )}
            </Box>
            <GenericTable
              properties={getCurrentTabTableProperties().filter((col) => true)}
              data={data.filter((value) =>
                Object.values(value)
                  .map(String)
                  .reduce(
                    (accumulator, value) =>
                      accumulator || value.includes(search),
                    false
                  )
              )}
              sortFunction={sortingFunction}
              deleteRow={currentTab.deleteEntity ? deleteEntity : undefined}
              editRow={currentTab.editEntity ? editEntity : undefined}
              lengthOverride={true}
              valuesOverride={true}
              getRowKey={(row: any) => String(row.id || row.personalNumber || row["!id"] || row._id)}
            />
          </Box>
        </Box>
        {editPopupObject != null && (
          <ManageEditModel
            name={currentTab.label}
            currentCollection={currentTab.collection}
            manageObject={editPopupObject}
            setManageObject={setEditPopupObject}
            updateData={setNewData}
            updatedData={newData}
          />
        )}
      </PageWrapper>
    )
  );
};

export default ManageUsers;
