import { useTranslation } from "react-i18next";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import GenericTable from "../components/table/table";
import {
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
  entityType: any;
  deleteEntity: boolean;
  sort: (value: any, nextValue: any) => number;
  getData: () => Promise<any[]>;
};

const ManageUsers: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");
  const { ls } = useLocalStorage();
  const { connection } = useBackend();
  const tabs: Tab[] = [
    {
      label: t("platform"),
      icon: <AirplanemodeActiveIcon />,
      entityType: platformData,
      deleteEntity: ls.getAuthorization() == "admin",
      sort: (currentValue: platformData, nextValue: platformData) =>
        Number(currentValue.id) - Number(nextValue.id),
      getData: async () => {
        const data = await connection.getAllPlatforms();
        data.map((platformValue) => {
          platformValue["id"] = platformValue["_id"];
          delete platformValue["_id"];
        });
        return data;
      },
    },
    {
      label: t("instructor"),
      icon: <SchoolIcon />,
      entityType: UsersData,
      deleteEntity: true,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(nextValue.personalNumber) - Number(currentValue.personalNumber),
      getData: () => {
        return [];
      },
    },
    {
      label: t("inspectorInstructor"),
      icon: <SchoolIcon />,
      entityType: UsersData,
      deleteEntity: true,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(nextValue.personalNumber) - Number(currentValue.personalNumber),
      getData: () => {
        return [];
      },
    },
    {
      label: t("commanders"),
      icon: <KeyboardCommandKeyIcon />, // change here
      entityType: UsersData,
      deleteEntity: false,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(nextValue.personalNumber) - Number(currentValue.personalNumber),
      getData: () => {
        return [];
      },
    },
    {
      label: t("airCrew1"),
      icon: <PregnantWomanIcon />, // sunglassesIcon
      entityType: UsersData,
      deleteEntity: true,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(nextValue.personalNumber) - Number(currentValue.personalNumber),
      getData: () => {
        return [];
      },
    },
    {
      label: t("airCrew2"),
      icon: <AccessibleIcon />, // <MenuBookIcon />
      entityType: UsersData,
      deleteEntity: true,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(nextValue.personalNumber) - Number(currentValue.personalNumber),
      getData: () => {
        return [];
      },
    },
    {
      label: t("inspectors"),
      icon: <SportsEsportsIcon />,
      entityType: UsersData,
      deleteEntity: true,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(nextValue.personalNumber) - Number(currentValue.personalNumber),
      getData: () => {
        return [];
      },
    },
    {
      label: t("trainees"),
      icon: <TrainIcon />,
      entityType: UsersData,
      deleteEntity: true,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(nextValue.personalNumber) - Number(currentValue.personalNumber),
      getData: () => {
        return [];
      },
    },
    {
      label: t("technicians"),
      icon: <AccessibleIcon />,
      entityType: UsersData,
      deleteEntity: false,
      sort: (currentValue: UsersData, nextValue: UsersData) =>
        Number(nextValue.personalNumber) - Number(currentValue.personalNumber),
      getData: () => {
        return [];
      },
    },
    {
      label: t("flight"),
      icon: <AirplaneTicketIcon />,
      entityType: FlightData,
      deleteEntity: true,
      sort: (currentValue: FlightData, nextValue: FlightData) => {
        if (currentValue instanceof FlightData) {
          return nextValue.date.getTime() - currentValue.date.getTime();
        }
        return -1;
      },
      getData: () => {
        return [];
      },
    },
  ];
  const [currentTab, setCurrentTab] = useState<Tab>(tabs[0]);

  const createEntity = (index: number) => {
    const keys = Object.keys(new currentTab.entityType());

    return new currentTab.entityType(
      ...keys.map((val) => {
        if (val == "date") {
          return new Date(Math.random() * new Date().getTime());
        } else if (val == "id") {
          return 1;
        }
        return t(val) + index;
      })
    );
  };

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    currentTab.getData().then((fetchedData) => {
      setData(fetchedData);
    });
  }, [currentTab]);

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
              <NewUser
                callback={(entity: any) => {
                  console.log(entity);
                }}
              />
            )}
            {currentTab.entityType == FlightData && (
              <NewFlight
                callback={(entity: any) => {
                  console.log(entity);
                }}
              />
            )}
            {currentTab.entityType == platformData && (
              <NewPlatform
                callback={(entity: any) => {
                  console.log(entity);
                }}
              />
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
