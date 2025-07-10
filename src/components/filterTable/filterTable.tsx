import React, { type ReactNode } from "react";
import { Box } from "@mui/material";

interface FilterTableProps {
  children: ReactNode | ReactNode[];
}

const FilterTable: React.FC<FilterTableProps> = ({ children }) => {

  return <Box sx={{ display: "flex" }}>{children}</Box>;
};

export default FilterTable;
