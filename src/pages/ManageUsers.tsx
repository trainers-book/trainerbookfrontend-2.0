import { useTranslation } from "react-i18next";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import GenericTable from "../components/table/table";
import {
  Collections,
  FlightData,
  platformData,
  UsersData,
} from "../types/tables/manageTypes";
import { Box, SvgIcon } from "@mui/material";
import { useEffect, useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import AccessibleIcon from "@mui/icons-material/Accessible";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import TrainIcon from "@mui/icons-material/Train";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import SideBar from "../components/sidebar/sidebar";
import NewUser from "../components/Dynamics/newUserForm";
import NewFlight from "../components/Dynamics/newFlightForm";
import NewPlatform from "../components/Dynamics/newPlatformForm";
import FilterSearchBar from "../components/Dynamics/filterSearchBar";
import { useLocalStorage } from "../context/localStorageContext";
import { useBackend } from "../context/backendContext";

const sunglassesIcon: React.ReactNode = (
  <SvgIcon>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 12">
      <path
        d="M 5, 5 m -2, 0 a 2,2 0 1,0 12,0"
        fill="#000000"
        stroke="black"
        stroke-width="1"
      />
      <path
        d="M 22, 5 m -2, 0 a 2,2 0 1,0 12,0"
        fill="#000000"
        stroke="black"
        stroke-width="1"
      />
      <rect x="0.5" y="4" width="34" height="1.5" fill="#000000" />
    </svg>
  </SvgIcon>
);

type Tab = {
  label: string;
  icon: React.ReactNode;
  collection: string;
  deleteEntity: boolean;
  entityType: any;
  sort: (value: any, nextValue: any) => number;
  dataManipulation: (value: any) => void;
  entityToDbEntity: (entity: any) => any;
};

const userToDbEntity = (user: {
  personalNumber: string;
  firstName: string;
  lastName: string;
  platform: string;
  displayName: string;
}) => {
  return {
    _id: user.personalNumber,
    firstName: user.firstName,
    lastName: user.lastName,
    platform: user.platform,
    name: user.displayName,
  };
};

const ManageUsers: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");
  const { ls } = useLocalStorage();
  const { connection } = useBackend();
  const [data, setData] = useState<any[]>([]);
  const [newData, setNewData] = useState<boolean>(false);
  const tabs: Tab[] = [
    {
      label: t("platform"),
      icon: <AirplanemodeActiveIcon />,
      collection: Collections.PLATFORM,
      deleteEntity: ls.getAuthorization() == "admin",
      entityType: platformData,
      sort: (currentValue: platformData, nextValue: platformData) =>
        Number(currentValue.id) - Number(nextValue.id),
      dataManipulation: (platformValue) => {
        platformValue["id"] = platformValue["_id"];
        delete platformValue["_id"];
      },
      entityToDbEntity: (platform: { name: string }) => {
        return {
          name: platform.name,
        };
      },
    },
    {
      label: t("instructor"),
      icon: <SchoolIcon />,
      collection: Collections.INSTRUCTOR,
      deleteEntity: true,
      entityType: UsersData,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(currentValue.personalNumber) - Number(nextValue.personalNumber),
      dataManipulation: (instructorValue) => {
        instructorValue["personalNumber"] = instructorValue["_id"];
        delete instructorValue["_id"];
        instructorValue["platforms"] = instructorValue["platform"].join(", ");
      },
      entityToDbEntity: userToDbEntity,
    },
    {
      label: t("inspectorInstructor"),
      icon: <SchoolIcon />,
      collection: Collections.INSPECTOR_INSTRUCTOR,
      deleteEntity: true,
      entityType: UsersData,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(currentValue.personalNumber) - Number(nextValue.personalNumber),
      dataManipulation: (inspectorValue) => {
        inspectorValue["personalNumber"] = inspectorValue["_id"];
        delete inspectorValue["_id"];
        inspectorValue["platforms"] = inspectorValue["platform"].join(", ");
      },
      entityToDbEntity: userToDbEntity,
    },
    {
      label: t("commanders"),
      icon: <KeyboardCommandKeyIcon />,
      collection: Collections.COMMANDER,
      deleteEntity: false,
      entityType: UsersData,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(currentValue.personalNumber) - Number(nextValue.personalNumber),
      dataManipulation: (commanderValue) => {
        commanderValue["personalNumber"] = commanderValue["_id"];
        delete commanderValue["_id"];
        commanderValue["platforms"] = commanderValue["platform"].join(", ");
      },
      entityToDbEntity: userToDbEntity,
    },
    {
      label: t("airCrew1"),
      icon: <PregnantWomanIcon />, // sunglassesIcon
      collection: Collections.PILOT,
      deleteEntity: true,
      entityType: UsersData,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(currentValue.personalNumber) - Number(nextValue.personalNumber),
      dataManipulation: (pilotValue) => {
        pilotValue["personalNumber"] = pilotValue["_id"];
        delete pilotValue["_id"];
        pilotValue["platforms"] = pilotValue["platform"].join(", ");
      },
      entityToDbEntity: userToDbEntity,
    },
    {
      label: t("airCrew2"),
      icon: <AccessibleIcon />, // <MenuBookIcon />
      collection: Collections.NAVIGATOR,
      deleteEntity: true,
      entityType: UsersData,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(currentValue.personalNumber) - Number(nextValue.personalNumber),
      dataManipulation: (navigatorValue) => {
        navigatorValue["personalNumber"] = navigatorValue["_id"];
        delete navigatorValue["_id"];
        navigatorValue["platforms"] = navigatorValue["platform"].join(", ");
      },
      entityToDbEntity: userToDbEntity,
    },
    {
      label: t("inspectors"),
      icon: <SportsEsportsIcon />,
      collection: Collections.INSPECTOR,
      deleteEntity: true,
      entityType: UsersData,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(currentValue.personalNumber) - Number(nextValue.personalNumber),
      dataManipulation: (inspectorValue) => {
        inspectorValue["personalNumber"] = inspectorValue["_id"];
        delete inspectorValue["_id"];
        inspectorValue["platforms"] = inspectorValue["platform"].join(", ");
      },
      entityToDbEntity: userToDbEntity,
    },
    {
      label: t("trainees"),
      icon: <TrainIcon />,
      collection: Collections.TRAINER,
      deleteEntity: true,
      entityType: UsersData,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(currentValue.personalNumber) - Number(nextValue.personalNumber),
      dataManipulation: (trainerValue) => {
        trainerValue["personalNumber"] = trainerValue["_id"];
        delete trainerValue["_id"];
        trainerValue["platforms"] = trainerValue["platform"].join(", ");
      },
      entityToDbEntity: userToDbEntity,
    },
    {
      label: t("technicians"),
      icon: <AccessibleIcon />,
      collection: Collections.TECHNICIAN,
      deleteEntity: false,
      entityType: UsersData,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(currentValue.personalNumber) - Number(nextValue.personalNumber),
      dataManipulation: (technicianValue) => {
        technicianValue["personalNumber"] = technicianValue["_id"];
        delete technicianValue["_id"];
        technicianValue["platforms"] = technicianValue["platform"].join(", ");
      },
      entityToDbEntity: userToDbEntity,
    },
    {
      label: t("flights"),
      icon: <AirplaneTicketIcon />,
      collection: Collections.PRESERVED_FLIGHTNAME,
      deleteEntity: true,
      entityType: FlightData,
      sort: (currentValue: FlightData, nextValue: FlightData) => {
        if (currentValue instanceof FlightData) {
          return currentValue.date.getTime() - nextValue.date.getTime();
        }
        return -1;
      },
      dataManipulation: (flightNameValue) => {
        delete flightNameValue["_id"];
        flightNameValue["date"] = new Date(flightNameValue["date"]);
      },
      entityToDbEntity: (flight: {
        name: string;
        platform: string;
        date: Date;
      }) => {
        return {
          name: flight.name,
          platform: flight.platform,
          date: flight.date.getTime(),
        };
      },
    },
  ];
  const [currentTab, setCurrentTab] = useState<Tab>(tabs[tabs.length - 1]);

  const fetchData = async (
    collection: string,
    dataManipulation: (value: any) => void
  ) => {
    const data: any[] = await connection.getAllEntities(collection);
    data.map(dataManipulation);
    return data;
  };

  const addData = async (
    collection: string,
    entity: any,
    entityToDbEntity: (entity: any) => any
  ) => {
    const data = await connection.addEntity(
      entityToDbEntity(entity),
      collection
    );
    if (data.success) {
      setNewData(!newData);
    }
  };

  const fetchServerData = () => {
    setData([]);

    fetchData(currentTab.collection, currentTab.dataManipulation).then(
      (fetchedData) => {
        setData(fetchedData);
      }
    );
  };

  const submitEntity = (entity: any) => {
    addData(currentTab.collection, entity, currentTab.entityToDbEntity);
  };

  useEffect(() => {
    fetchServerData();
  }, [currentTab]);

  useEffect(() => {
    fetchServerData();
  }, [newData]);

  return (
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
            {currentTab.entityType == UsersData && (
              <NewUser callback={submitEntity} />
            )}
            {currentTab.entityType == FlightData && (
              <NewFlight callback={submitEntity} />
            )}
            {currentTab.entityType == platformData && (
              <NewPlatform callback={submitEntity} />
            )}
          </Box>
          <GenericTable
            properties={Object.keys(new currentTab.entityType()).filter(
              (col) => true
            )}
            data={data.filter((value) =>
              Object.values(value)
                .map(String)
                .reduce(
                  (accumulator, value) => accumulator || value.includes(search),
                  false
                )
            )}
            sortFunction={currentTab.sort}
            deleteRow={
              currentTab.deleteEntity
                ? (row) => {
                    setData(
                      data.filter((val) => {
                        setSearch(search + "");
                        return JSON.stringify(val) != JSON.stringify(row);
                      })
                    );
                  }
                : undefined
            }
          />
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default ManageUsers;
