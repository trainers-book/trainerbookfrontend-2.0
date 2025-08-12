import { useState } from "react";
import { Box, Button } from "@mui/material";
import FilterDropdown from "../Dynamics/filterDropdown";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import FilterDate from "../Dynamics/filterDate";
import "../../i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { platformTypes } from "../../types/platformTypes";
import { Status } from "../../types/statuses";
import { Severity } from "../../types/issuesSeverity";
import { usePlatforms } from "../../context/platformsContext";

interface FilterIssuesProps {
  selectedPlatform: string[];
  setSelectedPlatform: (values: string[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (values: string[]) => void;
  selectedSeverities: string[];
  setSelectedSeverities: (values: string[]) => void;
  search: string;
  setSearch: (value: string) => void;
  dateSelected: string;
  setDate: (value: string) => void;
}

const FilterIssues: React.FC<FilterIssuesProps> = ({
  selectedPlatform,
  setSelectedPlatform,
  selectedStatuses,
  setSelectedStatuses,
  selectedSeverities,
  setSelectedSeverities,
  search,
  setSearch,
  dateSelected,
  setDate,
}) => {
  const { t } = useTranslation();
  const { platforms } = usePlatforms();
  const [isReset, setIsReset] = useState(false);

  const isFilterSelected =
    selectedPlatform.length != 0 ||
    selectedStatuses.length != 0 ||
    selectedSeverities.length != 0 ||
    search != "" ||
    dateSelected != "";

  return (
    <Box sx={{ mr: 1, display: "flex" }}>
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
        label={t("status")}
        options={Object.values(Status)}
        selected={selectedStatuses}
        setSelected={setSelectedStatuses}
        isMultiple={true}
        width="9rem"
        isReset={isReset}
      />
      <FilterDropdown
        label={t("severity")}
        options={Object.values(Severity)}
        selected={selectedSeverities}
        setSelected={setSelectedSeverities}
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
    </Box>
  );
};

export default FilterIssues;
