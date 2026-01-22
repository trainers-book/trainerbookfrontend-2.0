import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import DynamicTextField from "../../Dynamics/DynamicTextField";
import CloseIcon from "@mui/icons-material/Close";
import TimerModel from "../../timer/timer";
import ClickedOutside from "../clickedOutside";
import FilterDropdown from "../../Dynamics/filterDropdown";
import { flightDisturbancesTypes } from "../../../types/flightDisturbancesTypes";

const NewMalfModel: React.FC = () => {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(0);
  const [selectedDisturbance, setSelectedDisturbance] = useState<string[]>([]);
  const [malfNameValue, setMalfNameValue] = useState<string>("");
  const [malfDescriptionValue, setMalfDescriptionValue] = useState<string>("");
  const [timerValue, setTimerValue] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    if (
      selectedDisturbance.length > 0 ||
      malfNameValue !== "" ||
      malfDescriptionValue !== "" ||
      timerValue ||
      (selectedDisturbance.length > 0 &&
        malfNameValue !== "" &&
        malfDescriptionValue !== "")
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [selectedDisturbance, malfNameValue, malfDescriptionValue, timerValue]);

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirm(true);
    } else {
      setShow(false);
      setShowConfirm(false);
    }
    setMalfNameValue("");
    setMalfDescriptionValue("");
    setTimerValue(false);
  };

  const handleConfirmClose = () => {
    setShow(false);
    setShowConfirm(false);
    setSeconds(0);
  };

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  const formatTime = (totalSeconds: number): string => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleShow}
        sx={{
          background: "rgba(255, 125, 113, 0.8)",
          color: "rgba(0, 0, 0, 1)",
        }}
      >
        {t("newMalf")}
      </Button>

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
        <DialogTitle>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogTitle align="center" variant="h4">
          {t("newMalf")}
        </DialogTitle>

        <DialogContent>
          <Grid container justifyContent="center" padding={1}>
            <Grid size={12}>
              <Stack spacing={2}>
                <DynamicTextField
                  label={t("malfName")}
                  width="100%"
                  onChange={(e) => setMalfNameValue(e.target.value)}
                ></DynamicTextField>
                <DynamicTextField
                  label={t("malfDescription")}
                  width="100%"
                  multiline
                  rows={5}
                  onChange={(e) => setMalfDescriptionValue(e.target.value)}
                ></DynamicTextField>
                <FilterDropdown
                  label={t("flightDisturbances")}
                  options={flightDisturbancesTypes}
                  selected={selectedDisturbance}
                  setSelected={setSelectedDisturbance}
                  isMultiple={false}
                  width="100%"
                />
              </Stack>
            </Grid>
            <Grid container spacing={1} padding={2} justifyContent="center">
              <Grid size={5}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {t("goTime")}
                </Typography>
              </Grid>
              <Grid size={2.5}>
                <Typography>{formatTime(seconds)}</Typography>
              </Grid>
              <TimerModel
                onTick={(val) => setSeconds(val)}
                label={t("startMalfTimer")}
                onChange={(e) => setTimerValue(e.target.checked)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ background: "rgb(114, 156, 240)" }}
          >
            {t("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <ClickedOutside
        open={showConfirm}
        onCancel={handleCancelClose}
        onConfirm={handleConfirmClose}
        title={t("confirmExit")}
        content={t("areYouSureYouWantToExit")}
      />
    </>
  );
};

export default NewMalfModel;
