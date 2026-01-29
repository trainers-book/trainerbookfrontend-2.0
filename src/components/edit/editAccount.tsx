import FilterDropdown from "../Dynamics/filterDropdown";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import "../../i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { Roles, UsersAccountData } from "../../types/tables/manageTypes";
import { useLocalStorage } from "../../context/localStorageContext";

interface EditAccountProps {
  accountData: UsersAccountData;
  objectCallback: (data: UsersAccountData) => void;
  invokeCallback: boolean;
}

const EditAccount: React.FC<EditAccountProps> = ({
  accountData,
  objectCallback,
  invokeCallback,
}) => {
  const { t } = useTranslation();
  const { ls } = useLocalStorage();
  const [firstName, setFirstName] = useState<string>(accountData.firstName);
  const [lastName, setLastName] = useState<string>(accountData.lastName);
  const [password, setPassword] = useState<string>(accountData.password);
  const [personalNumber, setPersonalNumber] = useState<string>(
    accountData.personalNumber
  );
  const [accountPlatforms, setAccountPlatforms] = useState<string[]>(
    accountData.platforms as string[]
  );
  const [role, setRole] = useState<string[]>([accountData.role]);

  useEffect(() => {
    objectCallback(
      new UsersAccountData(
        personalNumber,
        firstName,
        lastName,
        accountPlatforms,
        password,
        role[0],
        accountData.id
      )
    );
  }, [invokeCallback]);

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
        <FilterSearchBar
          label={t("password")}
          value={password}
          setSearch={setPassword}
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
          selected={accountPlatforms}
          setSelected={setAccountPlatforms}
          isMultiple={true}
          width="10rem"
          isReset={false}
        />
        <FilterDropdown
          label={t("role")}
          options={Object.values(Roles)}
          selected={role}
          setSelected={setRole}
          isMultiple={false}
          width="10rem"
          isReset={false}
          errorColor={role[0] == "Admin"}
        />
      </Box>
    </Box>
  );
};

export default EditAccount;
