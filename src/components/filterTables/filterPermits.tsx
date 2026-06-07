import { useState } from "react";
import { Box, Button } from "@mui/material";
import FilterDropdown from "../Dynamics/filterDropdown";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import FilterDate from "../Dynamics/filterDate";
import "../../i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { PermitStatus } from "../../types/statuses";
import { usePlatforms } from "../../context/platformsContext";

interface FilterPermitsProps {
  selectedPlatform: string[];
  setSelectedPlatform: (values: string[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (values: string[]) => void;
  search: string;
  setSearch: (value: string) => void;
  dateSelected: { minDate: Date; maxDate: Date } | undefined;
  setDate: (value: { minDate: Date; maxDate: Date } | undefined) => void;
}

const FilterPermits: React.FC<FilterPermitsProps> = ({
  selectedPlatform,
  setSelectedPlatform,
  selectedStatuses,
  setSelectedStatuses,
  search,
  setSearch,
  dateSelected,
  setDate,
}) => {
  const { t } = useTranslation();
  const { platforms } = usePlatforms();
  const [isReset, setIsReset] = useState(false);

  const isFilterSelected =
    (selectedPlatform.length != 0 && platforms.length > 1) ||
    selectedStatuses.length != 0 ||
    search != "" ||
    dateSelected != undefined;

  return (
    <Box sx={{ mr: 1, display: "flex", gap: 1 }}>
      <FilterDropdown
        label={t("platform")}
        options={platforms}
        selected={selectedPlatform}
        setSelected={setSelectedPlatform}
        isMultiple={true}
        width="9rem"
        isReset={isReset}
      />
      <FilterDropdown
        label={t("permitStatus")}
        options={Object.values(PermitStatus)}
        selected={selectedStatuses}
        setSelected={setSelectedStatuses}
        isMultiple={true}
        width="9rem"
        isReset={isReset}
      />
      <FilterSearchBar
        label={t("search")}
        setSearch={setSearch}
        isReset={isReset}
      />
      {/*TODO: add second date selector in order to select a open date or expired date */}
      {/* <FilterDate setDate={setDate} isReset={isReset} width="3.3rem"/> */}
      {isFilterSelected && (
        <Button
          variant="contained"
          sx={{
            color: "rgba(0, 0, 0, 1)",
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
    </Box>
  );
};

export default FilterPermits;
