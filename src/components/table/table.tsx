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

interface TableProps {
  properties: string[];
  data: any[];
  sortFunction?: (val: any, nexVal: any) => number;
  getRowClass?: (row: IssueData) => string;
  color?: boolean;
  editRow?: (row: any) => void;
  deleteRow?: (row: any) => void;
  onScroll?: (event: any) => void;
  tableRef?: any;
}

const GenericTable: React.FC<TableProps> = ({
  properties,
  data,
  sortFunction,
  getRowClass,
  color,
  editRow,
  deleteRow,
  onScroll,
  tableRef,
}) => {
  const tableHeightPercent = 85;
  const tableRowHeight = 82;
  const { t } = useTranslation();
  const sortedData = sortFunction ? data.sort(sortFunction) : data;
  const columns = properties.slice();

  if (color != undefined) {
    columns.push("!color");
  }
  if (editRow != undefined) {
    columns.push("!edit");
  }
  if (deleteRow != undefined) {
    columns.push("!delete");
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
                {editRow != undefined && (
                  <TableCell sx={{ width: 0 }} align="center">
                    {/* TODO: add logic to editRow */}
                    <IconButton onClick={() => editRow}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
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
