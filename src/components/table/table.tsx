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
  IconButton,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Status } from "../../types/statuses";
import IssueData from "../../types/tables/issues";
import { Severity } from "../../types/issuesSeverity";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBackend } from "../../context/backendContext";
import { usePlatforms } from "../../context/platformsContext";
import { HttpStatusCode } from "axios";

interface TableProps {
  properties: string[];
  data: any[];
  sortFunction?: (val: any, nexVal: any) => number;
  filterFunction?: (data: any[]) => any[];
  getRowClass?: (row: IssueData) => string;
  color?: boolean;
  deleteRow?: (row: any) => void;
  onScroll?: (event: any) => void;
  tableRef?: any;
}

const GenericTable: React.FC<TableProps> = ({
  properties,
  data,
  sortFunction,
  filterFunction,
  getRowClass,
  color, 
  deleteRow,
  onScroll,
  tableRef
}) => {
  const tableHeightPercent = 85;
  const tableRowHeight = 82;
  const tableFetchExtra = 4;
  const tableHeadHeight = 56.5;

  const { t } = useTranslation();
  const columns = properties.slice();
  if (color != undefined) {
    columns.push("!color");
  }
  if (deleteRow != undefined) {
    columns.push("!delete");
  }

  // const [offset, setOffset] = useState(0);
  // const [sortedData, setSortedData] = useState(data.sort(sortFunction));
  // const limit = Math.round(
  //   (window.innerHeight * (tableHeightPercent / 100)) / tableRowHeight +
  //     tableFetchExtra
  // );
  // const [dataToShow, setdataToShow] = useState(
  //   sortedData.slice(offset, limit * offset)
  // );
  // const [dataToShow, setdataToShow] = useState([]);

  // useEffect(() => {
  //   fetchMoreData();
  // }, [offset]);

  // useEffect(() => {
  //   setOffset(0);
  //   const sorted = data.sort(sortFunction);
  //   setSortedData(sorted);
  //   setdataToShow(sorted.slice(0, limit));
  // }, [data]);

  // useEffect(() => {
  //   fetchMoreData();
  // }, [platforms]);

  // const fetchMoreData = async () => {
  //   if (platforms.length == 0) {
  //     return;
  //   }

  //   const newData = await connection.getObjects(
  //     fetchCollection,
  //     offset * 25,
  //     platforms
  //   );
  //   console.log(newData);

  //   // const newData = sortedData.slice(offset * limit, (offset + 1) * limit);
  //   if (newData.status == HttpStatusCode.Ok) {
  //     setdataToShow([
  //       ...new Set([
  //         ...dataToShow,
  //         ...(newData.data.map(
  //           (malf) =>
  //             new IssueData(
  //               new Date(malf.date),
  //               malf._id,
  //               malf.failureDetails,
  //               malf.malfunctionOpener,
  //               malf.failureDetails,
  //               malf.platform,
  //               malf.disruption,
  //               malf.failureStatus
  //             )
  //         ).sort(sortFunction)),
  //       ]),
  //     ]);
  //   }
  // };

  // const handleScroll = (event: any) => {
  //   const children = document.getElementById("table")?.childElementCount;
  //   const target = event.target;

  //   if (
  //     target.scrollTop + target.offsetHeight + tableHeadHeight >=
  //     tableRowHeight * (children ? children : 1)
  //   ) {
  //     setTimeout(() => {
  //       setOffset(offset + 1);
  //     }, 100); // timeout to simulate fetch time from server
  //   }
  // };

  const valueToMultipleLines = (
    value: Date | string | number | Status | Severity
  ) => {
    if (!value && value != 0) {
      return [null];
    }
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

  const filteredData = filterFunction ? filterFunction(data) : data;
  const sortedData = sortFunction ? filteredData.sort(sortFunction) : data;

  return (
    <Box
      sx={{
        height: tableHeightPercent + "vh",
        overflowY: "auto",
      }}
      onScroll={onScroll}
    >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ background: "rgba(218, 218, 218, 1)" }}>
            <TableRow>
              {columns.map((column) => {
                if (column.includes("!")) {
                  column = "";
                }
                return (
                  <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
                    align="center"
                  >
                    {t(column)}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody ref={tableRef} id="table">
            {sortedData.map((dataSet) => (
              <TableRow
                sx={{
                  ":hover": { background: "rgba(212, 237, 255, 0.102)" },
                  "&:last-child td, &:last-child th": {
                    border: 0,
                    minHeight: 80,
                  },
                  height: tableRowHeight,
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
                {deleteRow != undefined && (
                  <TableCell sx={{ width: 0 }} align="center">
                    <IconButton onClick={() => deleteRow(dataSet)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
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
