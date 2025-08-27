import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import NumberInput from "../../Dynamics/numberFieldInput";
import GridDatePicker from "../../datePicker/gridDatePicker";
import FullDatePicker from "../../datePicker/fullDatePicker";

interface ExcelExportOptionsProps {
  show: boolean;
  setShow: (value: boolean) => void;
  exportFunction: () => void;
}

const ExcelExportOptions: React.FC<ExcelExportOptionsProps> = ({
  show,
  setShow,
  exportFunction,
}) => {
  const { t } = useTranslation();

  const handleClose = () => {
    setShow(false);
  };

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
        <FullDatePicker
          rangeDate={true}
          pickCallback={(picked) => {
            console.log(picked);
          }}
          minYear={2019}
        />
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={exportFunction}
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
