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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Status } from "../../types/statuses";

import DeleteIcon from '@mui/icons-material/Delete';

interface TableProps {
  properties: any;
  data: any[];
  getRowClass?: (row: any) => string;
  color?: boolean;
  deleteRow?: (row: any) => void;
}

const GenericTable: React.FC<TableProps> = ({
  properties,
  data,
  getRowClass,
  color,
  deleteRow,
}) => {
  const { t } = useTranslation();
  const columns = Object.keys(properties);
  if (color != undefined) {
    columns.push("!color");
  }
  if (deleteRow != undefined) {
    columns.push("!delete");
  }

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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ background: "#dadada" }}>
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
        <TableBody>
          {data.map((dataSet) => (
            <TableRow
              sx={{
                ":hover": { background: "#d4edff1a" },
                "&:last-child td, &:last-child th": { border: 0 },
              }}
              key={dataSet.flightNumber}
            >
              {Object.values(dataSet)
                .map((rowValue) =>
                  valueToMultipleLines(rowValue as string | number | Date)
                )
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
                <TableCell
                  sx={{ width: 0 }}
                  align="center"
                ><IconButton onClick={() => deleteRow(dataSet)}><DeleteIcon/></IconButton></TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenericTable;
