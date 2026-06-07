import FilterDropdown from "../Dynamics/filterDropdown";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import "../../i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { UsersData } from "../../types/tables/manageTypes";
import { useLocalStorage } from "../../context/localStorageContext";

interface EditUserProps {
  userData: UsersData;
  objectCallback: (data: UsersData) => void;
  invokeCallback: boolean;
}

const EditUser: React.FC<EditUserProps> = ({
  userData,
  objectCallback,
}) => {
  const { t } = useTranslation();
  const { ls } = useLocalStorage();
  const [firstName, setFirstName] = useState<string>(userData.firstName);
  const [lastName, setLastName] = useState<string>(userData.lastName);
  const [personalNumber, setPersonalNumber] = useState<string>(
    userData.personalNumber
  );
  const [userPlatforms, setUserPlatforms] = useState<string[]>(
    userData.platforms as string[]
  );

  useEffect(() => {
    objectCallback(
      new UsersData(personalNumber, firstName, lastName, userPlatforms),
    );
  }, [personalNumber, firstName, lastName, userPlatforms, objectCallback]);

  return (
    <Box sx={{ mr: 1, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <FilterSearchBar
          label={t("personalNumber")}
          value={personalNumber}
          setSearch={setPersonalNumber}
          isReset={false}
          width="9rem"
        />
        <FilterSearchBar
          label={t("firstName")}
          value={firstName}
          setSearch={setFirstName}
          isReset={false}
          width="9rem"
        />
        <FilterSearchBar
          label={t("lastName")}
          value={lastName}
          setSearch={setLastName}
          isReset={false}
          width="9rem"
        />
      </Box>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <FilterDropdown
          label={t("platform")}
          options={ls.getPlatforms() as string[]}
          selected={userPlatforms}
          setSelected={setUserPlatforms}
          isMultiple={true}
          width="10rem"
          isReset={false}
        />
      </Box>
    </Box>
  );
};

export default EditUser;
