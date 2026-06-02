import { Box, IconButton, SvgIcon } from "@mui/material";
import "../../i18n";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import ExcelExportOptions from "../Popup/excelExports/excelExportOptions";
import { useBackend } from "../../context/backendContext";
import { usePlatforms } from "../../context/platformsContext";
import { HttpStatusCode } from "axios";

const excelImage = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <rect
      x="6"
      y="11"
      width="28"
      height="18"
      fill="#ffffff"
      stroke="#1F6E43"
      strokeWidth={1}
    />
    <polygon points="5,10 5,30 23,35 23,5" fill="#1F6E43" />

    <line x1="22" y1="14" x2="26" y2="14" stroke="#1F6E43" strokeWidth={2} />
    <line x1="27" y1="14" x2="32" y2="14" stroke="#1F6E43" strokeWidth={2} />

    <line x1="22" y1="17" x2="26" y2="17" stroke="#1F6E43" strokeWidth={2} />
    <line x1="27" y1="17" x2="32" y2="17" stroke="#1F6E43" strokeWidth={2} />

    <line x1="22" y1="20" x2="26" y2="20" stroke="#1F6E43" strokeWidth={2} />
    <line x1="27" y1="20" x2="32" y2="20" stroke="#1F6E43" strokeWidth={2} />

    <line x1="22" y1="23" x2="26" y2="23" stroke="#1F6E43" strokeWidth={2} />
    <line x1="27" y1="23" x2="32" y2="23" stroke="#1F6E43" strokeWidth={2} />

    <line x1="22" y1="26" x2="26" y2="26" stroke="#1F6E43" strokeWidth={2} />
    <line x1="27" y1="26" x2="32" y2="26" stroke="#1F6E43" strokeWidth={2} />

    <line
      x1="10"
      y1="14"
      x2="17"
      y2="27"
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <line
      x1="17"
      y1="13"
      x2="10"
      y2="26"
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

interface ExcelExportProps {
  dataObject: any;
  tableDataName: string;
}

const ExcelExport: React.FC<ExcelExportProps> = ({
  dataObject,
  tableDataName,
}) => {
  const { t } = useTranslation();
  const { connection } = useBackend();
  const { platforms } = usePlatforms();
  const objectKeys = Object.keys(dataObject);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const splitPlatformData = (data: any[]) => {
    return Object.values(
      data.reduce((acc, obj) => {
        const key = obj["platform"];
        if (!acc[key]) {
          acc[key] = { [key]: [] };
        }
        acc[key][key].push(obj);
        return acc;
      }, {})
    );
  };

  const excelExport = async (pickedDates: {minDate: Date, maxDate: Date}) => {
    const issues = await connection.getEntitiesByDate("FlightFailure", platforms, pickedDates);
    if (issues.status == HttpStatusCode.Ok) {  
      const workbook = XLSX.utils.book_new();
      const platfromsData = splitPlatformData(issues.data);
      
      platfromsData.forEach((platform) => {
        const platformName = Object.keys(platform)[0];

        const worksheet = XLSX.utils.json_to_sheet(platform[platformName], {
          header: objectKeys.map((val) => t(val)),
          skipHeader: false,
        });
        XLSX.utils.book_append_sheet(workbook, worksheet, platformName);
      });                                                                                                                                                                                                                                                                                                                                                               

      XLSX.writeFile(workbook, tableDataName + ".xlsx");
    }
  };

  return (
    <Box>
      <IconButton sx={{ p: 0, ml: 1 }} onClick={() => setShowPopup(true)}>
        <SvgIcon sx={{ width: "2.5rem", height: "2.5rem" }}>
          {excelImage}
        </SvgIcon>
      </IconButton>
      <ExcelExportOptions show={showPopup} setShow={setShowPopup} exportFunction={excelExport} />
    </Box>
  );
};

export default ExcelExport;
