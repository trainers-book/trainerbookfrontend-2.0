import FilterDropdown from "../Dynamics/filterDropdown";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import FilterDate from "../Dynamics/filterDate";
import "../../i18n";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { platformTypes } from "../../types/platformTypes";

import { Box } from "@mui/material";
import { Button } from "@mui/material";

interface FilterFlightsProps {
  selectedPlatform: string[];
  setSelectedPlatform: (values: string[]) => void;
  search: string;
  setSearch: (value: string) => void;
  dateSelected: string;
  setDate: (value: string) => void;
}

const FilterFlights: React.FC<FilterFlightsProps> = ({
  selectedPlatform,
  setSelectedPlatform,
  search,
  setSearch,
  dateSelected,
  setDate,
}) => {
  const [isReset, setIsReset] = useState(false);
  const isFilterSelected = selectedPlatform.length != 0 || search != "" || dateSelected != "";
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
      <div>
        {isFilterSelected && (
          <Button
            sx={{
              color: "black",
              background: "rgba(250, 119, 119, 0.58)",
              mr: 1,
              borderRadius: 2,
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
            }}
            onClick={() => {
              setIsReset(true);
              setTimeout(() => setIsReset(false), 100);
            }}
          >
            {t("clear")}
          </Button>
        )}
      </div>
    </Box>
  );
};

export default FilterFlights;
