import "./table.css";
import "../../i18n";
import React, { useEffect, useRef, useState } from "react";
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
import FlightData from "../../types/tables/flight";
import { Status } from "../../types/statuses";
import type IssueData from "../../types/tables/issues";

interface TableProps {
  properties: FlightData | IssueData;
  data: FlightData[] | IssueData[];
  getRowClass?: (row: IssueData) => string;
  color?: boolean;
}

const GenericTable: React.FC<TableProps> = ({
  properties,
  data,
  getRowClass,
  color,
}) => {
  const { t } = useTranslation();
  const columns = Object.keys(properties);
  if (color != undefined) {
    columns.push("");
  }

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 15; // Number of rows to fetch at a time
  const [dataToShow, setdataToShow] = useState(data.slice(offset, limit * offset));

  useEffect(() => {
    fetchMoreData();
  }, [offset]);

  const fetchMoreData = async () => {
    const newData = data.slice(offset * limit, (offset + 1) * limit)
    setdataToShow([...dataToShow, ...newData]);
    setHasMore(offset + limit < 100); // Assuming there are 100 items in total
  };

  const handleScroll = (e) => {

    const target = e.target;

    if ((target.scrollTop + target.offsetHeight) >= (83 * (document.getElementById("table")?.childElementCount)) && hasMore) {
      setOffset(offset + 1);
    }    
  };  

  const valueToMultipleLines = (value: Date | string | number | Status) => {
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
      height: "85vh",
      overflowY: 'auto',
    }}
    onScroll={handleScroll}>

    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ background: "#dadada" }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.3rem" }} align="center">{t(column)}</TableCell>
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
              key={dataSet.flightNumber}
            >
              {Object.values(dataSet)
                .map((rowValue) => valueToMultipleLines(rowValue))
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
