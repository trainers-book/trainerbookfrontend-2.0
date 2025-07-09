import { Box } from "@mui/material";
import FilterSearchBar from "../Dynamics/filterSearchBar";
import "../../i18n";
import React from "react";

interface FilterSearchProps {
  label: string;
  setSearch: (value: string) => void;
}

const FilterSearchControl: React.FC<FilterSearchProps> = ({
    label,
    setSearch
}) => {
  return (
    <Box sx={{ mr: 1 }}>
      <FilterSearchBar
        label={label}
        setSearch={setSearch}
        width="9rem"
      />
    </Box>
  );
};

export default FilterSearchControl;
