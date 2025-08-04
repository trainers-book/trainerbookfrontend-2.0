import { Box } from "@mui/material";
import FilterDropdown from "../Dynamics/filterDropdown";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import FilterDate from "../Dynamics/filterDate";
import "../../i18n";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { platformTypes } from "../../types/platformTypes";

import {Button} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface FilterFlightsProps {
  selectedPlatform: string[];
  setSelectedPlatform: (values: string[]) => void;
  setSearch: (value: string) => void;
  setDate: (value: string) => void;
}

const FilterFlights: React.FC<FilterFlightsProps> = ({
  selectedPlatform,
  setSelectedPlatform,
  setSearch,
  setDate,
}) => {
  const [isReset, setIsReset] = useState(false);

  const { t } = useTranslation();
  return (
    <Box sx={{ mr: 1, display: "flex" }}>
      <FilterDropdown
        label={t("platform")}
        options={platformTypes}
        selected={selectedPlatform}
        setSelected={setSelectedPlatform}
        isMultiple={true}
        width="9rem"
        isReset={isReset}
      />
      <FilterSearchBar
        label={t("search")}
        setSearch={setSearch}
        isReset={isReset}
      />
      <FilterDate setDate={setDate} isReset={isReset} />
      <Button
      sx={{
        color:"black",
      }}
        onClick={() => {
          setIsReset(true);
          setTimeout(() => setIsReset(false), 100);
        }}
      >
        <DeleteIcon></DeleteIcon>
      </Button>
    </Box>
  );
};

export default FilterFlights;
