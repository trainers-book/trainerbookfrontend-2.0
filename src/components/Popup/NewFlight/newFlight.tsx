import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Stack,
  IconButton,
  Box,
  AlertColor,
} from "@mui/material";
import TimerPanel from "./TimerPanel";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import FilterDropdown from "../../Dynamics/filterDropdown";
import NewMalfModel from "../newMalf/newMalf";
import ClickedOutside from "../clickedOutside";
import { fieldError } from "../../../types/errors/fields";
import { usePlatforms } from "../../../context/platformsContext";
import { API_Pathes, useBackend } from "../../../context/backendContext";
import { HttpStatusCode } from "axios";
import CustomAlert from "../../Dynamics/CustomAlert";

interface NewFlight {
  open: boolean;
  onClose: (closed: boolean) => void;
  onSave?: (flight: any) => void;
}

const NewFlightModel: React.FC<NewFlight> = ({ open, onClose, onSave }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();
  const { platforms } = usePlatforms();
  const { connection } = useBackend();
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState<string[][]>([]);
  const [selectableField, setSelectableField] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<string[]>([]);
  const [timerPanelValue, setTimerPanelValue] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [touched, setTouched] = useState({
    platform: false,
    flight: false,
  });
  const [options, setOptions] = useState<string[][]>([]);
  const [malamEntities, setMalamEntities] = useState<number[]>([]);
  const [selectedMalamDome, setSelectedMalamDome] = useState<
    Record<number, string[]>
  >({});
  const [pilots, setPilots] = useState<string[]>([]);
  const [platformFlights, setPlatformFlights] = useState<string[]>([]);
  const [flightNumber, setFlightNumber] = useState(0);
  const [flightTime, setFlightTime] = useState(0);
  const [dateTime, setDateTime] = useState(new Date());
  const [draftMalfunctions, setDraftMalfunctions] = useState<any[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");

  useEffect(() => {
    setSelectableField([]);

    if (selectedPlatform.length !== 0) {
      setSelectedField([]);
      setSelectedFlight([]);
      setDraftMalfunctions([]);
      getSelectableFields();
      getPlatformFlights(selectedPlatform[0]);

      if (selectedPlatform[0] === t("MALAM")) {
        getMalamEntities();
        getPilots();
      }
    } else {
      setSelectableField([]);
      setSelectedField([]);
      setSelectedFlight([]);
      setPlatformFlights([]);
      setDraftMalfunctions([]);
    }
  }, [selectedPlatform]);

  useEffect(() => {
    if (selectableField.length > 0) {
      Promise.all(
        selectableField.map((field: any) => getVariables(field)),
      ).then((results) => {
        setOptions(results);
      });
    } else {
      setOptions([]);
    }
  }, [selectableField]);

  useEffect(() => {
    setHasChanges(
        selectedFlight.length > 0 ||
        selectedPlatform.length > 0 ||
        draftMalfunctions.length > 0 ||
        timerPanelValue ||
        selectedField.some((field) => field.length > 0),
    );
  }, [
    selectedFlight,
    selectedPlatform,
    draftMalfunctions,
    timerPanelValue,
    selectedField,
  ]);

  useEffect(() => {
    if (open && platforms.length === 1 && selectedPlatform.length === 0) {
      setSelectedPlatform(platforms);
    }
  }, [open, platforms, selectedPlatform]);

  const resetForm = () => {
    onClose(true);
    setShowConfirm(false);
    setSelectedPlatform([]);
    setSelectedFlight([]);
    setSelectableField([]);
    setSelectedField([]);
    setOptions([]);
    setPlatformFlights([]);
    setSelectedMalamDome({});
    setPilots([]);
    setMalamEntities([]);
    setTimerPanelValue(false);
    setFlightNumber(0);
    setFlightTime(0);
    setDateTime(new Date());
    setDraftMalfunctions([]);
    setTouched({
      platform: false,
      flight: false,
    });
  };

  const getPlatformFlights = async (platform: string) => {
    const platformFlights = await connection.getAllEntities(
      API_Pathes.PRESERVED_FLIGHT_NAME,
    );

    if (platformFlights.status === HttpStatusCode.Ok) {
      const translatedPlatform = t(platform, { lng: "heEn" });
      setPlatformFlights(
        platformFlights.data
          .filter(
            (flight: any) =>
              flight.platform === platform ||
              flight.platform === translatedPlatform,
          )
          .map((flight: any) => flight.name || flight.flightName)
          .filter(Boolean),
      );
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirm(true);
    } else {
      resetForm();
    }
  };

  const handleConfirmClose = () => {
    resetForm();
  };

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  const getSelectableFields = async () => {
    const newFlightSelectableFields = await connection.getAllEntities(
      API_Pathes.NEW_FLIGHT_FIELDS,
    );

    if (newFlightSelectableFields.status === HttpStatusCode.Ok) {
      const selectedPlatformValue = selectedPlatform[0];
      const translatedPlatform = t(selectedPlatformValue, { lng: "heEn" });
      const platformMatches = (value: any) => {
        const normalizedValue = String(value ?? "").trim().toLowerCase();
        const platformOptions = [selectedPlatformValue, translatedPlatform].map(
          (platform) => String(platform ?? "").trim().toLowerCase(),
        );

        return platformOptions.includes(normalizedValue);
      };

      setSelectableField(
        newFlightSelectableFields.data.filter((field: any) => {
          if (!Array.isArray(field.showFor)) {
            return platformMatches(field.showFor);
          }

          return field.showFor.some(platformMatches);
        }),
      );
    }
  };

  const getPilots = async () => {
    const pilotsByPlatform = await connection.getEntityByPlatform(
      API_Pathes.PILOT,
      [{ platform: selectedPlatform[0] }],
    );
    if (pilotsByPlatform.status === HttpStatusCode.Ok) {
      setPilots(pilotsByPlatform.data.map((field: any) => field.name));
    }
  };

  const getMalamEntities = async () => {
    const allMalamEntities = await connection.getAllEntities(
      API_Pathes.MALAM_ENTITIES,
    );

    if (allMalamEntities.status === HttpStatusCode.Ok) {
      setMalamEntities(allMalamEntities.data[0].domes);
    }
  };

  const getVariables = async (field: any) => {
    if (field.name !== undefined) {
      if (field.fieldOptions) {
        return field.fieldOptions;
      }

      const fieldVariables = await connection.getAllEntities(field.name);
      if (field.name === "MPD" && fieldVariables.status === HttpStatusCode.Ok) {
        return fieldVariables.data["data"].map(
          (field: any) => Object.values(field)[0],
        );
      }

      return fieldVariables && fieldVariables.status === HttpStatusCode.Ok
        ? fieldVariables.data.map((val: any) => val["name"])
        : [];
    }

    return field.fieldOptions.map((val: any) => (val.name ? val.name : val));
  };

  const getSelectedFieldValue = (display: string) => {
    const index = selectableField.findIndex((field) => field.display === display);
    return index >= 0 ? selectedField[index]?.[0] : undefined;
  };

  const getSelectedDynamicFields = () => {
    return Object.fromEntries(
      selectableField
        .map((field, index) => [
          field.fieldName ?? field.display,
          field.isMultiple ? selectedField[index] : selectedField[index]?.[0],
        ])
        .filter(([key, value]) => key && value !== undefined),
    );
  };

  const handleSaveFlight = async () => {
    if (selectedPlatform.length === 0) {
      setTouched((prev) => ({ ...prev, platform: true }));
      return;
    }

    if (selectedFlight.length === 0) {
      setTouched((prev) => ({ ...prev, flight: true }));
      return;
    }

    const flightData = {
      _id: flightNumber,
      platform: selectedPlatform[0],
      flightName: selectedFlight[0],
      flightNumber,
      dateTime: dateTime.getTime(),
      pilot: getSelectedFieldValue("טייס"),
      navigator: getSelectedFieldValue("נווט"),
      technician: getSelectedFieldValue("טכנאי"),
      observer: getSelectedFieldValue("מתצפתת"),
      block: getSelectedFieldValue("בלוק"),
      _malfNumbers: draftMalfunctions.map((malf) => malf.issueNumber),
      flightTime,
      ...getSelectedDynamicFields(),
      ...Object.fromEntries(
        Object.entries(selectedMalamDome).map(([key, value]) => [
          key,
          value[0],
        ]),
      ),
    };

    const response = await connection.addEntity(
      flightData,
      API_Pathes.PRESERVED_FLIGHTS
    );

    if (response.status === HttpStatusCode.Ok) {
      const malfunctionResponses = await Promise.all(
        draftMalfunctions.map((malfunction) =>
          connection.addEntity(
            {
              ...malfunction,
              platform: selectedPlatform[0],
              flightName: selectedFlight[0],
            },
            API_Pathes.FLIGHT_FAILURE,
          ),
        ),
      );

      if (
        malfunctionResponses.some(
          (malfunctionResponse) =>
            malfunctionResponse.status !== HttpStatusCode.Ok,
        )
      ) {
        setAlertSeverity("error");
        setAlertMessage(t("malfSaveError"));
        setAlertOpen(true);
        return;
      }

      resetForm();
      onSave?.(flightData);
      setAlertSeverity("success");
      setAlertMessage(t("saveSuccessful"));
      setAlertOpen(true);
      return;
    }

    setAlertSeverity("error");
    setAlertMessage(t("malfSaveError"));
    setAlertOpen(true);
  }; 

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
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
        <DialogTitle align="center" variant="h4" sx={{ pt: 0, pb: 0.5 }}>
          {t("newFlight")}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={8}>
              <Stack spacing={2} padding={1}>
                <FilterDropdown
                  label={t("choosePlatform")}
                  options={platforms}
                  selected={selectedPlatform}
                  setSelected={setSelectedPlatform}
                  isMultiple={false}
                  width="43rem"
                  isReset={false}
                  touched={touched.platform}
                  error={fieldError.platform}
                  onBlur={() => setTouched({ ...touched, platform: true })}
                />
              </Stack>
              {selectedPlatform.length > 0 && (
                <Stack spacing={2} padding={1}>
                  <FilterDropdown
                    label={t("flightName")}
                    options={platformFlights}
                    selected={selectedFlight}
                    setSelected={setSelectedFlight}
                    isMultiple={false}
                    width="43rem"
                    error={fieldError.flightName}
                    touched={touched.flight}
                    onBlur={() => setTouched({ ...touched, flight: true })}
                  />
                </Stack>
              )}
              <Stack padding={1} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3.7 }}>
                  {selectableField.map((field: any, index: number) => (
                    <FilterDropdown
                      key={field._id || index}
                      label={field.display}
                      options={options[index] !== undefined ? options[index] : []}
                      selected={selectedField[index] || []}
                      setSelected={(currField) => {
                        setSelectedField((prevSelectedField) => {
                          const newSelectedField = [...prevSelectedField];
                          if (currField.length > 0) {
                            newSelectedField[index] = currField;
                          } else {
                            newSelectedField[index] = [];
                          }
                          return newSelectedField;
                        });
                      }}
                      isMultiple={field.isMultiple}
                      width="13rem"
                      isReset={false}
                    />
                  ))}
                </Box>
              </Stack>
              {selectedPlatform[0] === t("MALAM") && (
                <Stack spacing={2} padding={1} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3.7 }}>
                    {malamEntities.map((field) => (
                      <FilterDropdown
                        key={field}
                        label={field.toString()}
                        options={pilots}
                        selected={selectedMalamDome[field] || []}
                        setSelected={(currField) => {
                          setSelectedMalamDome((prevSelectedMalamDome) => ({
                            ...prevSelectedMalamDome,
                            [field]: currField,
                          }));
                        }}
                        isMultiple={false}
                        width="20.5rem"
                        isReset={false}
                      />
                    ))}
                  </Box>
                </Stack>
              )}
            </Grid>
            <Grid size={4}>
              <TimerPanel
                onChange={(e) => setTimerPanelValue(e.target.checked)}
                onFlightNumberChange={setFlightNumber}
                onFlightTimeChange={setFlightTime}
                onDateTimeChange={setDateTime}
              />
            </Grid>
          </Grid>
          {selectedPlatform.length > 0 && (
            <NewMalfModel
              fixedPlatform={selectedPlatform[0]}
              fixedFlightName={selectedFlight[0]}
              onDraftSave={(malfunction) =>
                setDraftMalfunctions((prev) => [...prev, malfunction])
              }
            />
          )}
        </DialogContent>
        <DialogActions sx={{ paddingLeft: 5 }}>
          <Button
            onClick={handleSaveFlight}
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

export default NewFlightModel;
