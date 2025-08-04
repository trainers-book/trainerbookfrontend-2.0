import { useState } from "react";
import { Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterDropdown from "../Dynamics/filterDropdown";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import FilterDate from "../Dynamics/filterDate";
import "../../i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import { platformTypes } from "../../types/platformTypes";
import { Status } from "../../types/statuses";
import { Severity } from "../../types/issuesSeverity";

interface FilterIssuesProps {
  selectedPlatform: string[];
  setSelectedPlatform: (values: string[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (values: string[]) => void;
  selectedSeverities: string[];
  setSelectedSeverities: (values: string[]) => void;
  setSearch: (value: string) => void;
  setDate: (value: string) => void;
}

const FilterIssues: React.FC<FilterIssuesProps> = ({
  selectedPlatform,
  setSelectedPlatform,
  selectedStatuses,
  setSelectedStatuses,
  selectedSeverities,
  setSelectedSeverities,
  setSearch,
  setDate,
}) => {
  const { t } = useTranslation();

  const [isReset, setIsReset] = useState(false);

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
      <Button
        sx={{
          color: "black",
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

export default FilterIssues;
