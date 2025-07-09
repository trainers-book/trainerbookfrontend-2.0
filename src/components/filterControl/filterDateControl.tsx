import { Box } from "@mui/material";
import FilterDate from "../Dynamics/filterDate";
import "../../i18n";
import React from "react";

interface FilterDateProps {
    setDate: (value: string) => void;
}

const FilterDateControl: React.FC<FilterDateProps> = ({ setDate }) => {
  return (
    <Box sx={{ mr: 1 }}>
      <FilterDate
        setDate={setDate}
        width="9rem"
      />
    </Box>
  );
};

export default FilterDateControl;
