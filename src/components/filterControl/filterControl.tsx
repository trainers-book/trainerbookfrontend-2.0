import { Box } from "@mui/material";
import FilterDropdown from "../Dynamics/filterDropdown";
import "../../i18n";
import React from "react";

interface FilterControlsProps {
  label: string;
  options: string[];
  multiple: boolean;
  selected: string[];
  setSelected: (values: string[]) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  label,
  options,
  multiple,
  selected,
  setSelected,
}) => {
  return ( options.length > 1 &&
    <Box sx={{ mr: 1 }}>
      <FilterDropdown
        label={label}
        options={options}
        selected={selected}
        setSelected={setSelected}
        isMultiple={multiple}
        width="9rem"
      />
    </Box>
  );
};

export default FilterControls;
