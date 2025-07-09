import React, { useState, type ReactNode } from "react";
import { IconButton, Collapse, Box } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";

interface FilterTableProps {
  children: ReactNode | ReactNode[];
}

const FilterTable: React.FC<FilterTableProps> = ({ children }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <IconButton
        onClick={() => setShowFilters((prev) => !prev)}
        sx={{
          background: "#f0f0f0",
          color: "#000000",
          borderRadius: "20%",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
        }}
      >
        <TuneIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Box>
        <Collapse in={showFilters}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>{children}</Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default FilterTable;
