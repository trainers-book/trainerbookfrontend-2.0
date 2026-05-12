 import "./table.css";
import "../../i18n";
import React from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import FlightData from "../../types/tables/flight";
import PermitData from "../../types/tables/permits";

interface TableProps {
  properties: string[];
  data: any[];
  getRowKey: (row: any) => string;
  sortFunction?: (val: any, nexVal: any) => number;
  getRowClass?: (row: IssueData | PermitData) => string;
  color?: boolean;
  editRow?: (row: any) => void;
  deleteRow?: (row: any) => void;
  onScroll?: (event: any) => void;
  tableRef?: any;
  clickable?: (row: IssueData | FlightData) => void;
  tableHeight?: number;
  lengthOverride?: boolean;
  valuesOverride?: boolean;
}

const GenericTable: React.FC<TableProps> = ({
  properties,
  data,
  getRowKey,
  sortFunction,
  getRowClass,
  color,
  editRow,
  deleteRow,
  onScroll,
  tableRef,
  clickable,
  tableHeight,
  lengthOverride,
  valuesOverride
}) => {
  const tableHeightPercent = tableHeight ? tableHeight : 85;
  const tableRowHeight = 82;
  const { t } = useTranslation();
  const sortedData = sortFunction ? data.sort(sortFunction) : data;
  const columns = properties.slice();

  if (color != undefined) {
    columns.push("_color");
  }
  if (editRow != undefined) {
    columns.push("_edit");
  }
  if (deleteRow != undefined) {
    columns.push("_delete");
  }

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
    } else if (typeof value == "string" && value.length > 20) {
      const words = value.split(" ");
      valueArray = [];

      if (lengthOverride) {
        if (valuesOverride) {
          const values = value.split(", ");
          let index = 0;
          let currentRow = "";

          while (index < values.length) {
            currentRow += values[index] + ", ";
            index++;

            if (index > 0 && index % 7 == 0) {
              valueArray.push(currentRow.slice(0, currentRow.length - 2));
              currentRow = "";
            }
          }

          valueArray.push(currentRow.slice(0, currentRow.length - 2));
        } else if (words.length > 4) {
          const mid = Math.ceil(words.length / 2);
          const firstHalf  = words.slice(0, mid);
          const secondHalf = words.slice(mid);
          valueArray = [firstHalf.join(' '), secondHalf.join(' ')];
        } else {
          valueArray = [words.join(',')];
        }
      } else {
        let index = 0;
        let count = 0;
        let currentRow = "";
        for (let i = 0; i < 2; i++) {
          while (index < words.length - 1 && count + words[index].length <= 20) {
            currentRow += words[index] + " ";
            index++;
            count = currentRow.length;
          }

          valueArray.push(currentRow);
          currentRow = "";
          count = 0;
        }

        valueArray[1] = valueArray[1].slice(0, -1) + "...";
      }
    }

    return valueArray;
  };

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
            <TableRow key={"header"}>
              {columns.map((column) => {
                if (column.includes("_") && column != "_id") {
                  column = "";
                }
                return (
                  <TableCell
                    key={column}
                    sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
                    align="center"
                  >
                    {t(column, {lng: "he"})}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody ref={tableRef} id="table">
            {sortedData.map((dataSet) => (
              <TableRow
                key={getRowKey(dataSet)}
                sx={{
                  ":hover": { background: "rgba(212, 237, 255, 0.102)" },
                  "&:last-child td, &:last-child th": {
                    border: 0,
                    minHeight: 80,
                  },
                  height: tableRowHeight,
                }}
                onClick={() => {
                  if (clickable) {
                    clickable(dataSet);
                  }
                }}
              >
                {properties.map((col) => {
                  const splitedValue = valueToMultipleLines(dataSet[col]);

                  return (
                    <TableCell key={col} align="center">
                      {splitedValue.map((value, index) => (
                        <Typography
                          key={getRowKey(dataSet) + " " + col + " " + index}
                        >
                          {value}
                          <br></br>
                        </Typography>
                      ))}
                    </TableCell>
                  );
                })}
                {color != undefined && (
                  <TableCell
                    key={"color"}
                    sx={{ width: 0 }}
                    align="center"
                    className={
                      getRowClass != undefined ? getRowClass(dataSet) : ""
                    }
                  />
                )}
                {editRow != undefined && (
                  <TableCell sx={{ width: 0 }} align="center">
                    <IconButton onClick={() => editRow(dataSet)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                )}
                {deleteRow != undefined && (
                  <TableCell key={"delete"} sx={{ width: 0 }} align="center">
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
