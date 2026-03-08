import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import FullDatePicker from "../../datePicker/fullDatePicker";
import FullMonthPicker from "../../datePicker/monthPicker";

interface ExcelExportOptionsProps {
  show: boolean;
  setShow: (value: boolean) => void;
  exportFunction: (pickedDates: {minDate: Date, maxDate: Date}) => void;
}

enum ExportTypes {
  Date = "Date",
  DateRange = "DateRange",
  Month = "Month",
  MonthRange = "MonthRange",
}

const ExcelExportOptions: React.FC<ExcelExportOptionsProps> = ({
  show,
  setShow,
  exportFunction,
}) => {
  const { t } = useTranslation();
  const [exportChoice, setExportChoice] = useState<ExportTypes>(
    ExportTypes.Date
  );
  const [getMonth, setGetMonth] = useState<boolean>(false);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExportChoice(event.target.value as ExportTypes);    
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleExport = (pickedDates: {minDate: Date, maxDate: Date} | undefined) => {
    if (pickedDates) {
      exportFunction(pickedDates);
    }
  }

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            padding: 2,
          },
        },
      }}
    >
      <DialogTitle align="center" variant="h4">
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        {t("excelExport")}
      </DialogTitle>
      <DialogContent>
        <RadioGroup row value={exportChoice} onChange={handleChange}>
          {Object.values(ExportTypes).map((exportName) => <FormControlLabel
            value={exportName}
            control={<Radio />}
            label={t("export" + exportName)}
            sx={{ "& .MuiTypography-root": { fontSize: "0.8rem" } }}
          />)}
        </RadioGroup>
        {(exportChoice == ExportTypes.Date || exportChoice == ExportTypes.DateRange) && <FullDatePicker
          rangeDate={exportChoice == ExportTypes.DateRange}
          pickCallback={handleExport}
          minYear={2019}
          invokeCallback={getMonth}
        />}
        {(exportChoice == ExportTypes.Month || exportChoice == ExportTypes.MonthRange) && <FullMonthPicker
          rangeMonth={exportChoice == ExportTypes.MonthRange}
          pickCallback={handleExport}
          minYear={2019}
          invokeCallback={getMonth}
        />}
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={() => {setGetMonth(!getMonth)}}
          variant="contained"
          sx={{ background: "rgb(114, 156, 240)" }}
        >
          {t("export")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExcelExportOptions;
