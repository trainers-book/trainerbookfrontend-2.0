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
} from "@mui/material";
import TimerPanel from "./TimerPanel";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import FilterDropdown from "../../Dynamics/filterDropdown";
import { platformTypes } from "../../../types/platformTypes";
import NewMalfModel from "../newMalf/newMalf";
import ClickedOutside from "../clickedOutside";
import { fieldError } from "../../../types/errors/fields";
import { usePlatforms } from "../../../context/platformsContext";
import { API_Pathes, useBackend } from "../../../context/backendContext";
import { HttpStatusCode } from "axios";

interface NewFlight {
  open: boolean;
  onClose: (closed: boolean) => void;
};

const NewFlightModel: React.FC<NewFlight> = ({ open, onClose }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();
  const { platforms } = usePlatforms();
  const { connection } = useBackend();
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState<string[][]>([]);
  const [selectableField, setSelectableField] = useState<any>([]);
  const [selectedFlight, setSelectedFlight] = useState<string[]>([]);
  const [timerPanelValue, setTimerPanelValue] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [touched, setTouched] = useState({
    platform: false,
    flight: false,
  });
  const [options, setOptions] = useState<string[]>([]);
  const [malamEntities, setMalamEntities] = useState<number[]>([]);
  const [selectedMalamDome, setSelectedMalamDome] = useState<Record<number, string[]>>({});
  const [pilots, setPilots] = useState<string[]>([]);

  useEffect(() => {
    setSelectableField([]);

    if (selectedPlatform.length !== 0) {
      setSelectedField([]);
      getSelectableFields();
      
      if (selectedPlatform[0] === t("MALAM")) {
        getMalamEntities();
        getPilots();
      }
    } else {
      setSelectableField([]);
      setSelectedField([]);
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
    if (
      selectedFlight.length > 0 ||
      selectedPlatform.length > 0 ||
      timerPanelValue ||
      (selectedFlight.length > 0 && selectedPlatform.length > 0)
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [selectedFlight, selectedPlatform, timerPanelValue]);

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirm(true);
    } else {
      onClose(true);
      setShowConfirm(false);
    }
    setTimerPanelValue(false);
    setTouched({
      platform: false,
      flight: false,
    });
  };

  const handleConfirmClose = () => {
    onClose(true);
    setShowConfirm(false);
    setSelectedPlatform([]);
    setSelectedFlight([]);
  };

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  const getSelectableFields = async () => {
    const newFlightSelectableFields = await connection.getAllEntities(API_Pathes.NEW_FLIGHT_FIELDS);

    if (newFlightSelectableFields.status === HttpStatusCode.Ok) {
    setSelectableField(
        newFlightSelectableFields.data.filter((field: any) =>
          field.showFor.includes(t(selectedPlatform[0], { lng: "heEn" })),
        ),
    );
    }
  };

  const getPilots = async () => {
    const pilotsByPlatform = await connection.getEntityByPlatform(API_Pathes.PILOT, [
      { platform: selectedPlatform[0] },
    ]);
    if (pilotsByPlatform.status === HttpStatusCode.Ok) {
    setPilots(
        pilotsByPlatform.data.map((field: any) => {
          return field.name;
        }),
    );
    }
  };

  const getMalamEntities = async () => {
    const allMalamEntities = await connection.getAllEntities(API_Pathes.MALAM_ENTITIES);

    if (allMalamEntities.status === HttpStatusCode.Ok) {
      setMalamEntities(allMalamEntities.data[0].domes);
    }
  };

  const getVariables = async (field: any) => {
    if (field.name !== undefined) {
      if (field.fieldOptions) {
        return field.fieldOptions;
      } else {
        const fieldVariables = await connection.getAllEntities(field.name);
        if (
          field.name === "MPD" &&
          fieldVariables.status === HttpStatusCode.Ok
        ) {
          return fieldVariables.data["data"].map((field: any) => Object.values(field)[0]);
        }
        return fieldVariables && fieldVariables.status === HttpStatusCode.Ok
          ? fieldVariables.data.map((val: any) => val["name"])
          : [];
      }
    } else {
      return field.fieldOptions.map((val: any) => (val.name ? val.name : val));
    }
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
          {t("newFlight")} 🛫
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
              <Stack spacing={2} padding={1}>
                <FilterDropdown
                  label={t("flightName")}
                  options={["flightName"]}
                  selected={selectedFlight}
                  setSelected={setSelectedFlight}
                  isMultiple={false}
                  width="43rem"
                  error={fieldError.flightName}
                  touched={touched.flight}
                  onBlur={() => setTouched({ ...touched, flight: true })}
                />
              </Stack>
              <Stack padding={1} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3.7 }}>
                  {selectableField.map((field: any, index: number) => (
                    <FilterDropdown
                      key={field._id || index}
                      label={field.display}
                      options={
                        options[index] !== undefined ? options[index] : []
                      }
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
              />
            </Grid>
          </Grid>
          <NewMalfModel />
        </DialogContent>
        <DialogActions sx={{ paddingLeft: 5 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ background: "rgb(114, 156, 240)" }}
          >
            {t("finishFlight")}
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

export default NewFlightModel;
