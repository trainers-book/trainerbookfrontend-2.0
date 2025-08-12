import "./table.css";
import "../../i18n";
import React, { useEffect, useState } from "react";
import {
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableCell,
  Table,
  TableBody,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Status } from "../../types/statuses";
import type IssueData from "../../types/tables/issues";
import { Severity } from "../../types/issuesSeverity";

interface TableProps {
  properties: string[];
  data: any[];
  sortFunction: (val: any, nexVal: any) => number;
  getRowClass?: (row: IssueData) => string;
  color?: boolean;
}

const GenericTable: React.FC<TableProps> = ({
  properties,
  data,
  sortFunction,
  getRowClass,
  color,
}) => {
  const tableHeightPercent = 85;
  const tableRowHeight = 82;
  const tableFetchExtra = 4;
  const tableHeadHeight = 56.5;

  const { t } = useTranslation();
  const columns = properties.slice()
  if (color != undefined) {
    columns.push("");
  }

  const [offset, setOffset] = useState(0);
  const [sortedData, setSortedData] = useState(data.sort(sortFunction));
  const limit = Math.round(((window.innerHeight * (tableHeightPercent / 100)) / tableRowHeight) + tableFetchExtra);
  const [dataToShow, setdataToShow] = useState(sortedData.slice(offset, limit * offset));

  useEffect(() => {
    fetchMoreData();
  }, [offset]);
  
  useEffect(() => {
    setOffset(0);
    const sorted = data.sort(sortFunction);
    setSortedData(sorted);
    setdataToShow(sorted.slice(0, limit));
  }, [data]);

  const fetchMoreData = async () => {
    const newData = sortedData.slice(offset * limit, (offset + 1) * limit)
    setdataToShow([...new Set([...dataToShow, ...newData])]);
  };

  const handleScroll = (event: any) => {
    const children = document.getElementById("table")?.childElementCount;
    const target = event.target;


    if ((target.scrollTop + target.offsetHeight + tableHeadHeight) >= (tableRowHeight * (children ? children : 1))) {
      setTimeout(() => {setOffset(offset + 1)}, 100); // timeout to simulate fetch time from server
    }    
  };  

  const valueToMultipleLines = (
    value: Date | string | number | Status | Severity
  ) => {
    let valueArray: string[] = [value.toString()];

    if (value instanceof Date) {
      valueArray = [
        value.toLocaleDateString("en-GB"),
        value.toLocaleTimeString([], {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      ];
    }

    return valueArray;
  };

  return (
    <Box sx={{
      height: tableHeightPercent + "vh",
      overflowY: 'auto',
    }}
    onScroll={handleScroll}>

    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ background: "#dadada" }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
                align="center"
              >
                {t(column)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody id="table">
          {dataToShow.map((dataSet) => (
            <TableRow
              sx={{
                ":hover": { background: "#d4edff1a" },
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              {properties
                .map((col) => valueToMultipleLines(dataSet[col]))
                .map((linesValues) => (
                  <TableCell align="center">
                    {linesValues.map((value) => (
                      <Typography>
                        {value}
                        <br></br>
                      </Typography>
                    ))}
                  </TableCell>
                ))}
              {color != undefined && (
                <TableCell
                  sx={{ width: 0 }}
                  align="center"
                  className={
                    getRowClass != undefined ? getRowClass(dataSet) : ""
                  }
                />
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
};

export default GenericTable;
