import FilterDropdown from "../Dynamics/filterDropdown";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import "../../i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { PreservedFlightNameData } from "../../types/tables/manageTypes";
import { useLocalStorage } from "../../context/localStorageContext";

interface EditFlightProps {
  preservedFlightNameData: PreservedFlightNameData;
  objectCallback: (data: PreservedFlightNameData) => void;
  invokeCallback: boolean;
}

const EditFlight: React.FC<EditFlightProps> = ({
  preservedFlightNameData,
  objectCallback,
}) => {
  const { t } = useTranslation();
  const { ls } = useLocalStorage();
  const [name, setName] = useState<string>(preservedFlightNameData.name);
  const [accountPlatforms, setAccountPlatforms] = useState<string[]>(
    [preservedFlightNameData.platform]
  );

  useEffect(() => {
    objectCallback(
      new PreservedFlightNameData(
        preservedFlightNameData.date,
        name,
        accountPlatforms[0],
        preservedFlightNameData._id,
      ),
    );
  }, [
    preservedFlightNameData.date,
    preservedFlightNameData._id,
    name,
    accountPlatforms,
    objectCallback,
  ]);

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
          label={t("flightName")}
          value={name}
          setSearch={setName}
          isReset={false}
          width="20rem"
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
          isMultiple={false}
          width="10rem"
          isReset={false}
        />
      </Box>
    </Box>
  );
};

export default EditFlight;
