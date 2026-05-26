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
  AlertColor,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import DynamicTextField from "../../Dynamics/DynamicTextField";
import CloseIcon from "@mui/icons-material/Close";
import TimerModel from "../../timer/timer";
import ClickedOutside from "../clickedOutside";
import FilterDropdown from "../../Dynamics/filterDropdown";
import CustomAlert from "../../Dynamics/CustomAlert";
import { Severity } from "../../../types/issuesSeverity";
import {
  API_Pathes,
  CollectionIds,
  useBackend,
} from "../../../context/backendContext";
import { useLocalStorage } from "../../../context/localStorageContext";
import { HttpStatusCode } from "axios";

interface NewMalfModelProps {
  platformOptions?: string[];
}

const NewMalfModel: React.FC<NewMalfModelProps> = ({
  platformOptions = [],
}) => {
  const { t } = useTranslation();
  const { ls } = useLocalStorage();
  const { connection } = useBackend();

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerValue, setTimerValue] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedDisturbance, setSelectedDisturbance] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [selectedFlightName, setSelectedFlightName] = useState<string[]>([]);
  const [flightOptions, setFlightOptions] = useState<string[]>([]);
  const [malfNameValue, setMalfNameValue] = useState<string>("");
  const [malfDescriptionValue, setMalfDescriptionValue] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [issueId, setIssueId] = useState<number>(1);

  useEffect(() => {
    if (
      selectedDisturbance.length > 0 ||
      selectedPlatform.length > 0 ||
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
  }, [
    selectedDisturbance,
    selectedPlatform,
    selectedFlightName,
    malfNameValue,
    malfDescriptionValue,
    timerValue,
  ]);

  useEffect(() => {
    fetchNextMalfId();
  }, []);

  useEffect(() => {
    if (selectedPlatform.length === 0) {
      setSelectedFlightName([]);
      setFlightOptions([]);
      return;
    }

    fetchPreservedFlights();
  }, [selectedPlatform, connection]);

  const fetchPreservedFlights = async () => {
    const preserved = await connection.getAllEntities(
      API_Pathes.PRESERVED_FLIGHTS,
    );
    if (preserved.status === HttpStatusCode.Ok) {
      setFlightOptions([]);
      return;
    }

    const options = [
      ...new Set(
        preserved.data
          .filter((flight: any) => flight.platform === selectedPlatform[0])
          .map((flight: any) => flight.name || flight.flightName)
          .filter(Boolean),
      ),
    ] as string[];

    setFlightOptions(options);
    setSelectedFlightName([]);
  };

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
    setSelectedPlatform([]);
    setSelectedFlightName([]);
    setFlightOptions([]);
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

  const fetchNextMalfId = async () => {
    const response = await connection.getNextId(CollectionIds.MALF_ID);

    if (response.status === HttpStatusCode.Ok) {
      const seq = Number(response.data[0].sequenceValue);
      setIssueId(isNaN(seq) ? 1 : seq);
    }
  };

  const handleValidSave = async () => {
    if (platformOptions.length > 0 && selectedPlatform.length === 0) {
      setAlertSeverity("warning");
      setAlertMessage(t("choosePlatform"));
      setAlertOpen(true);
      return;
    }

    if (platformOptions.length > 0 && selectedFlightName.length === 0) {
      setAlertSeverity("warning");
      setAlertMessage(t("chooseFlight"));
      setAlertOpen(true);
      return;
    }

    if (malfNameValue !== "" && malfDescriptionValue !== "") {
      const malfObj: any = {
        _id: issueId,
        dateTime: Date.now(),
        issueDescription: malfDescriptionValue,
        issueSeverity: selectedDisturbance[0] || undefined,
        issueOpener: ls.getDisplayName ? ls.getDisplayName() : undefined,
        malfSystem: malfNameValue,
        platform: selectedPlatform[0] || undefined,
        flightName: selectedFlightName[0] || undefined,
        failureStatus: "Active",
      };

      try {
        const response = await connection.addEntity(
          malfObj,
          API_Pathes.FLIGHT_FAILURE,
        );

        if (response.status === HttpStatusCode.Ok) {
          setShow(false);
          setShowConfirm(false);
          setSeconds(0);
          setMalfNameValue("");
          setMalfDescriptionValue("");
          setTimerValue(false);
          setSelectedDisturbance([]);
          setSelectedPlatform([]);
          setAlertSeverity("success");
          setAlertMessage(t("malfSaved"));
          setAlertOpen(true);
        } else {
          setAlertSeverity("error");
          setAlertMessage(t("malfSaveError"));
          setAlertOpen(true);
        }
      } catch (error) {
        setAlertSeverity("error");
        setAlertMessage(t("malfSaveError"));
        setAlertOpen(true);
      }
    } else {
      setAlertSeverity("warning");
      setAlertMessage(t("fillAllFields"));
      setAlertOpen(true);
    }
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
          {t("newMalf")} 🔨
        </DialogTitle>

        <DialogContent>
          <Grid container justifyContent="center" padding={1}>
            <Grid size={12}>
              <Stack spacing={2}>
                {platformOptions.length > 0 && (
                  <FilterDropdown
                    label={t("choosePlatform")}
                    options={platformOptions}
                    selected={selectedPlatform}
                    setSelected={setSelectedPlatform}
                    isMultiple={false}
                    width="100%"
                  />
                )}
                {selectedPlatform.length > 0 && (
                  <FilterDropdown
                    label={t("chooseFlight")}
                    options={flightOptions}
                    selected={selectedFlightName}
                    setSelected={setSelectedFlightName}
                    isMultiple={false}
                    width="100%"
                  />
                )}
                {(platformOptions.length === 0 ||
                  selectedFlightName.length > 0) && (
                  <>
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
                      options={Object.values(Severity)}
                      selected={selectedDisturbance}
                      setSelected={setSelectedDisturbance}
                      isMultiple={false}
                      width="100%"
                    />
                  </>
                )}
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
            onClick={() => {
              handleValidSave();
            }}
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
      <CustomAlert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
        severity={alertSeverity}
      />
    </>
  );
};

export default NewMalfModel;
