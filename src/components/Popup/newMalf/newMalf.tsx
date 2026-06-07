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
import FilterSearchBar from "../../Dynamics/filterSearchBar";
import CustomAlert from "../../Dynamics/CustomAlert";
import { Severity } from "../../../types/issuesSeverity";
import {
  API_Pathes,
  CollectionIds,
  useBackend,
} from "../../../context/backendContext";
import { useLocalStorage } from "../../../context/localStorageContext";
import { HttpStatusCode } from "axios";
import { Status } from "../../../types/statuses";

interface NewMalfModelProps {
  platformOptions?: string[];
  fixedPlatform?: string;
  fixedFlightName?: string;
  onDraftSave?: (malfunction: any) => void;
}

const NewMalfModel: React.FC<NewMalfModelProps> = ({
  platformOptions = [],
  fixedPlatform,
  fixedFlightName,
  onDraftSave,
}) => {
  const { t } = useTranslation();
  const { ls } = useLocalStorage();
  const { connection } = useBackend();

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [timerValue, setTimerValue] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedDisturbance, setSelectedDisturbance] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [selectedOpenerType, setSelectedOpenerType] = useState<string[]>([]);
  const [selectedFlightName, setSelectedFlightName] = useState<string[]>([]);
  const [selectedMalfSystem, setSelectedMalfSystem] = useState<string[]>([]);
  const [customMalfSystem, setCustomMalfSystem] = useState<string>("");
  const [flightOptions, setFlightOptions] = useState<string[]>([]);
  const [malfSystemOptions, setMalfSystemOptions] = useState<string[]>([]);
  const [malfNameValue, setMalfNameValue] = useState<string>("");
  const [malfDescriptionValue, setMalfDescriptionValue] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [issueId, setIssueId] = useState<number>(1);
  const isFromNewFlight = Boolean(fixedPlatform);
  const savesAsDraft = Boolean(onDraftSave);
  const hasFixedPlatform = Boolean(fixedPlatform);

  useEffect(() => {
    if (show && platformOptions.length === 1 && selectedPlatform.length === 0 && !hasFixedPlatform) {
      setSelectedPlatform(platformOptions);
    }
  }, [show, platformOptions, selectedPlatform, hasFixedPlatform]);

  useEffect(() => {
    if (
      selectedDisturbance.length > 0 ||
      selectedPlatform.length > 0 ||
      selectedOpenerType.length > 0 ||
      selectedFlightName.length > 0 ||
      selectedMalfSystem.length > 0 ||
      customMalfSystem !== "" ||
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
    selectedOpenerType,
    selectedFlightName,
    selectedMalfSystem,
    customMalfSystem,
    malfNameValue,
    malfDescriptionValue,
    timerValue,
  ]);

  useEffect(() => {
    fetchNextMalfId();
  }, []);

  useEffect(() => {
    if (fixedPlatform) {
      setSelectedPlatform([fixedPlatform]);
    }
  }, [fixedPlatform]);

  useEffect(() => {
    if (fixedFlightName) {
      setSelectedOpenerType(["fixedFlight"]);
      setSelectedFlightName([fixedFlightName]);
    }
  }, [fixedFlightName]);

  useEffect(() => {
    if (selectedPlatform.length === 0) {
      setSelectedOpenerType([]);
      setSelectedFlightName([]);
      setSelectedMalfSystem([]);
      setCustomMalfSystem("");
      setFlightOptions([]);
      return;
    }

    fetchPreservedFlights();
    fetchMalfSystems();
  }, [selectedPlatform, connection]);

  useEffect(() => {
    if (fixedFlightName) {
      setSelectedFlightName([fixedFlightName]);
      setSelectedMalfSystem([]);
      setCustomMalfSystem("");
      return;
    }

    setSelectedFlightName(fixedFlightName ? [fixedFlightName] : []);
    setSelectedMalfSystem([]);
    setCustomMalfSystem("");
  }, [selectedOpenerType, fixedFlightName]);

  const fetchPreservedFlights = async () => {
    const preserved = await connection.getAllEntities(
      API_Pathes.PRESERVED_FLIGHTS,
    );

    if (preserved.status === HttpStatusCode.Ok) {
      const options = [
        ...new Set(
          preserved.data
            .filter((flight: any) => flight.platform === selectedPlatform[0])
            .map((flight: any) => flight.name || flight.flightName)
            .filter(Boolean),
        ),
      ] as string[];

      setFlightOptions(options);
    }
  };

  const fetchMalfSystems = async () => {
    const systems = await connection.getAllEntities("MalfunctionedSystems");

    if (systems.status === HttpStatusCode.Ok && Array.isArray(systems.data)) {
      const options = systems.data
        .map((system: any) =>
          system && typeof system === "object"
            ? (system.name ?? system.value)
            : system,
        )
        .filter(Boolean);
      setMalfSystemOptions(Array.from(new Set(options)));
    } else {
      setMalfSystemOptions([]);
    }
  };

  const resetForm = () => {
    setSeconds(0);
    setSelectedDisturbance([]);
    setMalfNameValue("");
    setMalfDescriptionValue("");
    setSelectedPlatform(fixedPlatform ? [fixedPlatform] : []);
    setSelectedOpenerType(fixedFlightName ? ["fixedFlight"] : []);
    setSelectedFlightName(fixedFlightName ? [fixedFlightName] : []);
    setSelectedMalfSystem([]);
    setCustomMalfSystem("");
    setFlightOptions([]);
    setTimerValue(false);
    setTimerResetKey((prev) => prev + 1);
  };

  const handleShow = () => {
    if (fixedPlatform) {
      setSelectedPlatform([fixedPlatform]);
    }
    if (fixedFlightName) {
      setSelectedOpenerType(["fixedFlight"]);
      setSelectedFlightName([fixedFlightName]);
    }
    setShow(true);
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirm(true);
      return;
    }

    setShow(false);
    setShowConfirm(false);
    resetForm();
  };

  const handleConfirmClose = () => {
    setShow(false);
    setShowConfirm(false);
    resetForm();
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
    if (
      !hasFixedPlatform &&
      platformOptions.length > 0 &&
      selectedPlatform.length === 0
    ) {
      setAlertSeverity("warning");
      setAlertMessage(t("choosePlatform"));
      setAlertOpen(true);
      return;
    }

    if (
      !isFromNewFlight &&
      (platformOptions.length > 0 || hasFixedPlatform) &&
      selectedOpenerType.length === 0
    ) {
      setAlertSeverity("warning");
      setAlertMessage("בחר פותח תקלה");
      setAlertOpen(true);
      return;
    }

    if (
      !isFromNewFlight &&
      (platformOptions.length > 0 || hasFixedPlatform) &&
      selectedOpenerType[0] === "מדריכה" &&
      selectedFlightName.length === 0
    ) {
      setAlertSeverity("warning");
      setAlertMessage(t("chooseFlight"));
      setAlertOpen(true);
      return;
    }

    if (
      !isFromNewFlight &&
      (platformOptions.length > 0 || hasFixedPlatform) &&
      selectedOpenerType[0] === "טכנאי" &&
      (selectedMalfSystem.length === 0 ||
        (selectedMalfSystem[0] === "אחר" && customMalfSystem === ""))
    ) {
      setAlertSeverity("warning");
      setAlertMessage(t("malfSystem"));
      setAlertOpen(true);
      return;
    }

    if (malfNameValue !== "" && malfDescriptionValue !== "") {
      const malfObj: any = {
        _id: issueId,
        issueNumber: issueId,
        issueName: malfNameValue,
        dateTime: Date.now(),
        platform: selectedPlatform[0] || undefined,
        issueDescription: malfDescriptionValue,
        issueSeverity: selectedDisturbance[0] || Severity.Low,
        issueOpener: ls.getDisplayName ? ls.getDisplayName() : undefined,
        malfSystem:
          selectedMalfSystem[0] === "אחר"
            ? customMalfSystem
            : selectedMalfSystem[0] || malfNameValue,
        flightName: selectedFlightName[0] || undefined,
        status: "Active",
        isVerified: false,
        goTime: seconds,
      };

      if (savesAsDraft) {
        onDraftSave?.(malfObj);
        setShow(false);
        setShowConfirm(false);
        resetForm();
        setIssueId((prev) => prev + 1);
        setAlertSeverity("success");
        setAlertMessage(t("malfSaved"));
        setAlertOpen(true);
        return;
      }

      try {
        const response = await connection.addEntity(
          malfObj,
          API_Pathes.FLIGHT_FAILURE,
        );

        if (response.status === HttpStatusCode.Ok) {
          setShow(false);
          setShowConfirm(false);
          resetForm();
          fetchNextMalfId();
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
      "0",
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
                {!hasFixedPlatform && (
                  <FilterDropdown
                    label={t("choosePlatform")}
                    options={platformOptions}
                    selected={selectedPlatform}
                    setSelected={setSelectedPlatform}
                    isMultiple={false}
                    width="100%"
                  />
                )}
                {!isFromNewFlight && selectedPlatform.length > 0 && (
                  <FilterDropdown
                    label={"בחר פותח תקלה"}
                    options={["מדריכה", "טכנאי"]}
                    selected={selectedOpenerType}
                    setSelected={setSelectedOpenerType}
                    isMultiple={false}
                    width="100%"
                  />
                )}
                {selectedOpenerType[0] === "מדריכה" && (
                  <FilterDropdown
                    label={t("chooseFlight")}
                    options={flightOptions}
                    selected={selectedFlightName}
                    setSelected={setSelectedFlightName}
                    isMultiple={false}
                    width="100%"
                  />
                )}
                {selectedOpenerType[0] === "טכנאי" && (
                  <>
                    <FilterDropdown
                      label={t("malfSystem")}
                      options={[...malfSystemOptions, "אחר"]}
                      selected={selectedMalfSystem}
                      setSelected={(values) => {
                        setSelectedMalfSystem(values);
                        setCustomMalfSystem("");
                      }}
                      isMultiple={false}
                      width="100%"
                    />
                    {selectedMalfSystem[0] === "אחר" && (
                      <FilterSearchBar
                        label={"מערכת תקלה אחר"}
                        value={customMalfSystem}
                        setSearch={setCustomMalfSystem}
                        isReset={false}
                        width="100%"
                      />
                    )}
                  </>
                )}
                {(isFromNewFlight ||
                  (platformOptions.length === 0 && !hasFixedPlatform) ||
                  selectedFlightName.length > 0 ||
                  (selectedMalfSystem.length > 0 &&
                    (selectedMalfSystem[0] !== "אחר" ||
                      customMalfSystem !== ""))) && (
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
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        mt: 0.5,
                        p: 1.5,
                        alignItems: "center",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        backgroundColor: "background.paper",
                      }}
                    >
                      <Grid size={2.5}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, textAlign: "right" }}
                        >
                          זמן תקלה
                        </Typography>
                      </Grid>
                      <Grid size={2.5}>
                        <Typography
                          sx={{
                            direction: "ltr",
                            fontVariantNumeric: "tabular-nums",
                            textAlign: "center",
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 1.5,
                            backgroundColor: "background.default",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          {formatTime(seconds)}
                        </Typography>
                      </Grid>
                      <Grid
                        size={7}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          minWidth: 0,
                        }}
                      >
                        <TimerModel
                          onTick={(val) => setSeconds(val)}
                          label={t("startMalfTimer")}
                          onChange={(e) => setTimerValue(e.target.checked)}
                          resetKey={timerResetKey}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </Stack>
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
