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
import DatePicker from "../../datePicker/datePicker";

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
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYears] = useState<number>(currentYear);

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
        <Box
          sx={{
            pt: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}>
            <NumberInput
              label={t("month")}
              setValue={(value: number) => {
                if (value >= 1 && value <= 12) {
                  setMonth(value);
                }
              }}
              width="9rem"
              value={month}
            />
            <NumberInput
              label={t("year")}
              setValue={(value: number) => {
                if (value >= 2019 && value <= currentYear) {
                  setYears(value);
                }
              }}
              width="9rem"
              value={year}
            />
          </Box>

          <DatePicker year={year} month={month} rangeDate={true} />
        </Box>
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
