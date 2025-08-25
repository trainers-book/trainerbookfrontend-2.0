import { IconButton, SvgIcon } from "@mui/material";
import "../../i18n";
import React from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

const excelImage = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <rect
      x="6"
      y="11"
      width="28"
      height="18"
      fill="#ffffff"
      stroke="#1F6E43"
      stroke-width="1"
    />
    <polygon points="5,10 5,30 23,35 23,5" fill="#1F6E43" />

    <line x1="22" y1="14" x2="26" y2="14" stroke="#1F6E43" stroke-width="2" />
    <line x1="27" y1="14" x2="32" y2="14" stroke="#1F6E43" stroke-width="2" />

    <line x1="22" y1="17" x2="26" y2="17" stroke="#1F6E43" stroke-width="2" />
    <line x1="27" y1="17" x2="32" y2="17" stroke="#1F6E43" stroke-width="2" />

    <line x1="22" y1="20" x2="26" y2="20" stroke="#1F6E43" stroke-width="2" />
    <line x1="27" y1="20" x2="32" y2="20" stroke="#1F6E43" stroke-width="2" />

    <line x1="22" y1="23" x2="26" y2="23" stroke="#1F6E43" stroke-width="2" />
    <line x1="27" y1="23" x2="32" y2="23" stroke="#1F6E43" stroke-width="2" />

    <line x1="22" y1="26" x2="26" y2="26" stroke="#1F6E43" stroke-width="2" />
    <line x1="27" y1="26" x2="32" y2="26" stroke="#1F6E43" stroke-width="2" />

    <line
      x1="10"
      y1="14"
      x2="17"
      y2="27"
      stroke="#ffffff"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="17"
      y1="13"
      x2="10"
      y2="26"
      stroke="#ffffff"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
);

interface ExcelExportProps {
  dataObject: any;
  data: any[];
}

const ExcelExport: React.FC<ExcelExportProps> = ({ data, dataObject }) => {
  const { t } = useTranslation();
  const objectKeys = Object.keys(dataObject);

  const excelExport = () => {
    const copiedArray = JSON.parse(JSON.stringify(data));
    copiedArray.forEach((value) => {
      objectKeys.forEach((key) => {
        value[t(key)] = value[key];
        if (key == "dateTime") {
          value[t(key)] = new Date(value[key]).toLocaleString("en-GB");            
        }

        delete value[key];
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(copiedArray, {
      header: objectKeys.map((val) => t(val)),
      skipHeader: false,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");
    XLSX.writeFile(workbook, "test.xlsx");
  };

  return (
    <IconButton sx={{ p: 0 }} onClick={excelExport}>
      <SvgIcon sx={{ width: "2.5rem", height: "2.5rem" }}>{excelImage}</SvgIcon>
    </IconButton>
  );
};

export default ExcelExport;
