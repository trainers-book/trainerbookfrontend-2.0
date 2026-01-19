import { useTranslation } from "react-i18next";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import GenericTable from "../components/table/table";
import {
  FlightData,
  platformData,
  UsersAccountData,
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
import NewUser from "../components/forms/newUserForm";
import NewFlight from "../components/forms/newFlightForm";
import NewPlatform from "../components/forms/newPlatformForm";
import FilterSearchBar from "../components/Dynamics/filterSearchBar";
import { useLocalStorage } from "../context/localStorageContext";
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
  show: boolean;
  icon: React.ReactNode;
  collection: string;
  deleteEntity: boolean;
  editEntity: boolean;
  addEntity: boolean;
  entityType: any;
  sort: (value: any, nextValue: any) => number;
  dataManipulation: (value: any) => void;
  entityToDbEntity: (entity: any) => any;
};

const userToDbEntity = (user: {
  idNumber: string;
  firstName: string;
  lastName: string;
  platform: string;
  displayName: string;
}) => {
  return {
    _id: user.idNumber,
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
  const [editPopupObject, setEditPopupObject] = useState<any>(null);

  const canDelete =
    ls.getAuthorization() == "admin" || ls.getAuthorization() == "Commander";
  const showAll =
    ls.getAuthorization() == "admin" ||
    ls.getAuthorization() == "Commander" ||
    ls.getAuthorization() == "Instructor";
  const canAdd =
    ls.getAuthorization() == "admin" || ls.getAuthorization() == "Commander";
  const tabs: Tab[] = [
    {
      label: t("platform"),
      show: ls.getAuthorization() == "admin",
      icon: <AirplanemodeActiveIcon />,
      collection: API_Pathes.PLATFORM,
      deleteEntity: ls.getAuthorization() == "admin",
      editEntity: ls.getAuthorization() == "admin",
      addEntity: ls.getAuthorization() == "admin",
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
      label: t("instructors"),
      show: showAll,
      icon: <SchoolIcon />,
      collection: API_Pathes.INSTRUCTOR,
      deleteEntity: canDelete,
      editEntity: ls.getAuthorization() == "admin",
      addEntity: canAdd,
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
      label: t("commanders"),
      show:
        ls.getAuthorization() == "admin" ||
        ls.getAuthorization() == "Commander",
      icon: <KeyboardCommandKeyIcon />,
      collection: API_Pathes.COMMANDER,
      deleteEntity: ls.getAuthorization() == "admin",
      editEntity: ls.getAuthorization() == "admin",
      addEntity: canAdd,
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
      show: showAll,
      icon: <PregnantWomanIcon />, // sunglassesIcon
      collection: API_Pathes.PILOT,
      deleteEntity: canDelete,
      editEntity: ls.getAuthorization() == "admin",
      addEntity: true,
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
      show: showAll,
      icon: <AccessibleIcon />, // <MenuBookIcon />
      collection: API_Pathes.NAVIGATOR,
      deleteEntity: canDelete,
      editEntity: ls.getAuthorization() == "admin",
      addEntity: true,
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
      label: t("trainees"),
      show: showAll,
      icon: <TrainIcon />,
      collection: API_Pathes.TRAINER,
      deleteEntity: canDelete,
      editEntity: ls.getAuthorization() == "admin",
      addEntity: true,
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
      show: true,
      icon: <AccessibleIcon />,
      collection: API_Pathes.TECHNICIAN,
      deleteEntity: canDelete,
      editEntity: ls.getAuthorization() == "admin",
      addEntity: canAdd,
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
      show: showAll,
      icon: <AirplaneTicketIcon />,
      collection: API_Pathes.PRESERVED_FLIGHTNAME,
      deleteEntity: ls.getAuthorization() == "admin",
      editEntity: ls.getAuthorization() == "admin",
      addEntity: true,
      entityType: FlightData,
      sort: (currentValue: FlightData, nextValue: FlightData) => {
        if (currentValue instanceof FlightData) {
          return currentValue.date.getTime() - nextValue.date.getTime();
        }
        return -1;
      },
      dataManipulation: (flightNameValue) => {
        flightNameValue["!id"] = flightNameValue["_id"];
        delete flightNameValue["_id"];
        flightNameValue["date"] = new Date(flightNameValue["date"]);
      },
      entityToDbEntity: (flight: {
        _id: number;
        name: string;
        platform: string;
        date: Date;
      }) => {
        return {
          _id: JSON.stringify(flight._id),
          name: flight.name,
          platform: flight.platform,
          date: flight.date.getTime(),
        };
      },
    },
  ];
  const [currentTab, setCurrentTab] = useState<Tab>(tabs[1]);

  const deleteEntity = async (row: any) => {
    let updateResponse;

    if (currentTab.entityType == platformData) {
      updateResponse = await connection.deleteObject(
        currentTab.collection,
        row.id
      );
    } else if (currentTab.entityType == FlightData) {
      updateResponse = await connection.deleteObject(
        currentTab.collection,
        row["!id"]
      );
    } else if (currentTab.entityType == UsersData) {
      updateResponse = await connection.deleteObject(
        currentTab.collection,
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
    if (
      currentTab.entityType == UsersData &&
      [t("instructors"), t("commanders"), t("technicians")].includes(
        currentTab.label
      )
    ) {
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
    } else if (currentTab.label == t("platform")) {
      setEditPopupObject(new platformData(row.name, row.id));
    } else if (currentTab.label == t("flights")) {
      setEditPopupObject(
        new FlightData(row.date, row.name, row.platform, row["!id"])
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

  const fetchData = async (
    collection: string,
    dataManipulation: (value: any) => void
  ) => {
    const entities: { status: number; data: any } =
      await connection.getAllEntities(collection);
    if (entities.status == HttpStatusCode.Ok) {
      entities.data.map(dataManipulation);
      return entities.data;
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
            {currentTab.addEntity && currentTab.entityType == UsersData && (
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
            deleteRow={currentTab.deleteEntity ? deleteEntity : undefined}
            editRow={currentTab.editEntity ? editEntity : undefined}
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
  );
};

export default ManageUsers;
