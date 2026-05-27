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
  TextField,
} from "@mui/material";

import TimerPanel from "./TimerPanel";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import FilterDropdown from "../../Dynamics/filterDropdown";
import { fieldError } from "../../../types/errors/fields";
import { usePlatforms } from "../../../context/platformsContext";
import { useBackend } from "../../../context/backendContext";
import NewMalfModel from "../newMalf/newMalf";
import ClickedOutside from "../clickedOutside";

const NewFlightModel: React.FC = () => {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { t } = useTranslation();
  const { platforms } = usePlatforms();
  const { connection } = useBackend();

  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [flightName, setFlightName] = useState("");

  const [selectedField, setSelectedField] = useState<string[][]>([]);
  const [selectableField, setSelectableField] = useState<any[]>([]);
  const [options, setOptions] = useState<string[][]>([]);

  const [timerPanelValue, setTimerPanelValue] = useState(false);

  const [touched, setTouched] = useState({
    platform: false,
    flight: false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const createFlightFields = "CreateFlightFields";

  const handleShow = () => setShow(true);

  const resetForm = () => {
    setShow(false);
    setShowConfirm(false);

    setSelectedPlatform([]);
    setFlightName("");
    setSelectableField([]);
    setSelectedField([]);
    setOptions([]);
    setTimerPanelValue(false);

    setTouched({
      platform: false,
      flight: false,
    });
  };

  const handleClose = () => {
    if (hasChanges) setShowConfirm(true);
    else resetForm();
  };

  const handleConfirmClose = () => resetForm();
  const handleCancelClose = () => setShowConfirm(false);

  useEffect(() => {
    if (selectedPlatform.length > 0) {
      getSelectableFields();
    } else {
      setSelectableField([]);
      setSelectedField([]);
      setOptions([]);
    }
  }, [selectedPlatform]);

  const getSelectableFields = async () => {
    const data = await connection.getAllObjects(createFlightFields);

    const filteredFields = data["selectableField"].filter((field: any) =>
      field.showFor.includes(t(selectedPlatform[0], { lng: "heEn" }))
    );

    setSelectableField(filteredFields);

    setSelectedField(
      Array(filteredFields.length).fill(null).map(() => [])
    );

    const loadedOptions = await Promise.all(
      filteredFields.map(async (field: any) => {
        if (field.name) {
          const res = await connection.getFieldByName(field.name);
          return res ? res.map((v: any) => v.name) : [];
        }

        return field.fieldOptions?.map((v: any) => v.name ?? v) || [];
      })
    );

    setOptions(loadedOptions);
  };

  useEffect(() => {
    setHasChanges(
      selectedPlatform.length > 0 ||
      flightName.trim().length > 0 ||
      timerPanelValue ||
      selectedField.length > 0
    );
  }, [selectedPlatform, flightName, timerPanelValue, selectedField]);

  const handleSaveFlight = async () => {
    if (!selectedPlatform[0]) return alert("Select platform");
    if (!flightName.trim()) return alert("Enter flight name");

    const dynamicFields: any = {};

    selectableField.forEach((field: any, index: number) => {
      dynamicFields[field.display] = selectedField[index] || [];
    });

    const flightData = {
      platform: selectedPlatform[0],
      flightName,
      dateTime: new Date(),
      ...dynamicFields,
    };

    console.log("SAVE:", flightData);

    await connection.createObject("PreservedFlights", flightData);

    resetForm();
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

      <Dialog open={show} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogTitle align="center" variant="h4">
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
                />
              </Stack>

              {/* SAME STYLE — ONLY ADD TEXTFIELD HERE */}
              <Stack spacing={2} padding={1}>
                <TextField
                  fullWidth
                  label={t("flightName")}
                  value={flightName}
                  onChange={(e) => setFlightName(e.target.value)}
                />
              </Stack>

              <Stack spacing={2} padding={1}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {selectableField.map((field: any, index: number) => (
                    <FilterDropdown
                      key={index}
                      label={field.display}
                      options={options[index] || []}
                      selected={selectedField[index] || []}
                      setSelected={(curr) => {
                        setSelectedField((prev) => {
                          const copy = [...prev];
                          copy[index] = curr;
                          return copy;
                        });
                      }}
                      isMultiple={field.isMultiple}
                      width="13rem"
                    />
                  ))}
                </Box>
              </Stack>
            </Grid>

            <Grid size={4}>
              <TimerPanel
                onChange={(e) => setTimerPanelValue(e.target.checked)}
              />
            </Grid>
          </Grid>

          <NewMalfModel />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleSaveFlight} variant="contained">
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