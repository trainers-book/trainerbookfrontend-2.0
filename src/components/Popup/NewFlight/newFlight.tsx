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
import { useBackend } from "../../../context/backendContext";

const NewFlightModel: React.FC = () => {
  const [show, setShow] = useState(false);
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
  const createFlightFields = "CreateFlightFields";
  const [options, setOptions] = useState<string[]>([]);
  const malamPlatforms = ["סופה", "ברק", "רעם", "בז"];
  const malamDomes = [130, 131, 132, 133, 140, 141, 142, 143];
  const [selectedMalamDome, setSelectedMalamDome] = useState<string[][]>([]);
  const [selectedConfiguration, setSelectedConfiguration] = useState<string[]>(
    []
  );
  const [MPD, setMPD] = useState<string[]>([]);
  const [selectedMPD, setSelectedMPD] = useState<string[]>([]);
  const [pilots, setPilots] = useState<string[]>([]);

  useEffect(() => {
    if (selectedPlatform.length !== 0) {
      const newSelectedField = Array(selectableField.length).fill([]);
      setSelectedField(newSelectedField);
      getSelectableFields();
      
      if (selectedPlatform[0] === t("eitam")) {
        getMPD();
      } else if (selectedPlatform[0] === t("malam")) {
        getPilots();
      }
    } else {
     // setSelectableField([]);
      setSelectedField([]);
    }
  }, [selectedPlatform, selectableField]);

  useEffect(() => {
    if (selectableField.length > 0) {
      Promise.all(
        selectableField.map((field: any) => getVariables(field))
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
    setTimerPanelValue(false);
    setTouched({
      platform: false,
      flight: false,
    });
  };

  const handleConfirmClose = () => {
    setShow(false);
    setShowConfirm(false);
    setSelectedPlatform([]);
    setSelectedFlight([]);
  };

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  const getSelectableFields = async () => {
    const data = await connection.getAllObjects(createFlightFields);

    setSelectableField(
      data["selectableField"].filter((field: any) =>
        field.showFor.includes(t(selectedPlatform[0], { lng: "heEn" }))
      )
    );
  };

  const getPilots = async () => {
    const data = await connection.getAllPilots();
    setPilots(
      data
        .filter((field: any) => field.platform.includes(selectedPlatform[0]))
        .map((field: any) => field.name)
    );
  };

  const getMPD = async () => {
    const data = await connection.getMPD();
    setMPD(data["data"].map((field: any) => Object.values(field)[0]));
  };

  const getVariables = async (field: any) => {
    if (field.name !== undefined) {
      const data = await connection.getFieldByName(field.name);
      return data ? data.map((val: any) => val["name"]) : [];
    } else {
      return field.fieldOptions.map((val: any) => (val.name ? val.name : val));
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleShow}
        sx={{ background: "rgb(114, 156, 240)", mr: 1, mb: 1 }}
      >
        {t("newFlight")}
      </Button>

      <Dialog
        open={show}
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
              <Stack spacing={2} padding={1}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {selectableField.map((field: any, index: number) => (
                    <FilterDropdown
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
              {selectedPlatform[0] === t("eitam") && (
                <Stack spacing={2} padding={1}>
                  <FilterDropdown
                    label={"MPD"}
                    options={MPD}
                    selected={selectedMPD}
                    setSelected={setSelectedMPD}
                    isMultiple={false}
                    width="43rem"
                  />
                </Stack>
              )}
              {selectedPlatform[0] === t("malam") && (
                <Stack spacing={2} padding={1} sx={{ mb: 2 }}>
                  <FilterDropdown
                    label={t("configuration")}
                    options={malamPlatforms}
                    selected={selectedConfiguration}
                    setSelected={setSelectedConfiguration}
                    isMultiple={false}
                    width="43rem"
                  />

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {malamDomes.map((field) => (
                      <FilterDropdown
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
