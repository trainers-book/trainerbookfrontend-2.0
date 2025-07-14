import { Box } from "@mui/material";
import FilterDropdown from "../Dynamics/filterDropdown";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import FilterDate from "../Dynamics/filterDate";
import "../../i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { platformTypes } from "../../types/platformTypes";

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
      />
      <FilterSearchBar label={t("search")} setSearch={setSearch} />
      <FilterDate setDate={setDate} />
    </Box>
  );
};

export default FilterFlights;
