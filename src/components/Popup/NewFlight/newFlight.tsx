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
import DynamicTextField from "../../Dynamics/DynamicTextField";
import CloseIcon from "@mui/icons-material/Close";
import FilterDropdown from "../../Dynamics/filterDropdown";
import { platformTypes } from "../../../types/platformTypes";
import NewMalfModel from "../newMalf/newMalf";
import ClickedOutside from "../clickedOutside";

const NewFlightModel: React.FC = () => {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [dynamicTextFieldValue, setDynamicTextFieldValue] = useState<string>("");
  const [timerPanelValue, setTimerPanelValue] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (
      selectedPlatforms.length > 0 ||
      dynamicTextFieldValue !== "" ||
      timerPanelValue
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [selectedPlatforms, dynamicTextFieldValue, timerPanelValue]);

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    if(hasChanges){
      setShowConfirm(true);
    }
    else {
      setShow(false);
      setShowConfirm(false);
    }
    setDynamicTextFieldValue("");
    setTimerPanelValue(false);
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
        sx={{ background: "rgb(114, 156, 240)" ,
          mr:1,
          mt:1,
          mb:1
        }}
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
          <Grid container justifyContent="center" padding={1}>
            <Grid size={8}>
              <FilterDropdown
                label={t("choosePlatform")}
                options={platformTypes}
                selected={selectedPlatforms}
                setSelected={setSelectedPlatforms}
                isMultiple={false}
                width="100%"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} padding={1}>
            <Grid size={8}>
              <Stack spacing={2}>
                <DynamicTextField
                  label={t("flightName")}
                  width="100%"
                  onChange={(e) => setDynamicTextFieldValue(e.target.value)}
                />
              </Stack>
            </Grid>
            <Grid size={4}>
              <TimerPanel onChange={(e) => setTimerPanelValue(e.target.checked)}/>
            </Grid>
          </Grid>
          <NewMalfModel />
        </DialogContent>
        <DialogActions>
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
