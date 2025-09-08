import FilterDropdown from "../Dynamics/filterDropdown";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import "../../i18n";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { FlightData } from "../../types/tables/manageTypes";
import { useLocalStorage } from "../../context/localStorageContext";

interface EditFlightProps {
  flightData: FlightData;
}

const EditFlight: React.FC<EditFlightProps> = ({ flightData }) => {
  const { t } = useTranslation();
  const { ls } = useLocalStorage();
  const [name, setName] = useState<string>(flightData.name);
  const [accountPlatforms, setAccountPlatforms] = useState<string[]>(
    [flightData.platform]
  );

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
          options={ls.getPlatforms()}
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
