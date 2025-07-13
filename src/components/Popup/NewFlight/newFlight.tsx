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
} from "@mui/material";
import TimerPanel from "./TimerPanel";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import FilterDropdown from "../../Dynamics/filterDropdown";
import { platformTypes } from "../../../types/platformTypes";
import NewMalfModel from "../newMalf/newMalf";
import ClickedOutside from "../clickedOutside";
import { fieldError } from "../../../types/errors/fields";

const NewFlightModel: React.FC = () => {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<string[]>([]);
  const [timerPanelValue, setTimerPanelValue] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [touched, setTouched] = useState({
    platform: false,
    flight: false,
  });

  useEffect(() => {
    if (selectedFlight.length > 0 && selectedPlatforms.length > 0) {
      setHasChanges(false);
    } else if (
      selectedFlight.length > 0 ||
      selectedPlatforms.length > 0 ||
      timerPanelValue
    ) {
    } else {
      setHasChanges(false);
    }
  }, [selectedPlatforms, selectedFlight, timerPanelValue]);

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
    setSelectedPlatforms([]);
  };

  const handleConfirmClose = () => {
    setShow(false);
    setShowConfirm(false);
  };

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleShow}
        sx={{ background: "rgb(114, 156, 240)", mr: 1, mt: 1, mb: 1 }}
      >
        {t("newFlight")}
      </Button>

      <Dialog
        open={show}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
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
                  options={platformTypes}
                  selected={selectedPlatforms}
                  setSelected={setSelectedPlatforms}
                  isMultiple={false}
                  width="100%"
                  touched={touched.platform}
                  error={fieldError.platform}
                  onBlur={() => setTouched({ ...touched, platform: true })}
                />
              </Stack>
              <Stack spacing={2} padding={1}>
                <FilterDropdown
                  label={t("flightName")}
                  options={platformTypes}
                  selected={selectedFlight}
                  setSelected={setSelectedFlight}
                  isMultiple={false}
                  width="100%"
                  error={fieldError.flightName}
                  touched={touched.flight}
                  onBlur={() => setTouched({ ...touched, flight: true })}
                />
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
