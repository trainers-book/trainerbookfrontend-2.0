import React, { useEffect, useState } from "react";
import {
  Box,
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
import ClickedOutside from "../clickedOutside";
import FilterDropdown from "../../Dynamics/filterDropdown";
import { usePlatforms } from "../../../context/platformsContext";
import { fieldError } from "../../../types/errors/fields";
import FullDatePicker from "../../datePicker/fullDatePicker";
import { useLocalStorage } from "../../../context/localStorageContext";
import { PermitStatus } from "../../../types/statuses";
import { useBackend } from "../../../context/backendContext";
import MissingData from "../missingData";
import ConfirmedPermit from "../confirmedPermit";

const permit = {
  _id: "",
  platform: "",
  permissionName: "",
  permissionDescription: "",
  permissionOpener: "",
  openingDate: new Date(),
  status: "",
  expirationDate: new Date(),
};

const NewPermitModel: React.FC = () => {
  const { connection } = useBackend();
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmPermit] = useState(false);
  const [showInvalidSave, setInvalidSave] = useState(false);
  const { t } = useTranslation();
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [permitNameValue, setPermitNameValue] = useState<string>("");
  const [permitDescriptionValue, setPermitDescriptionValue] =
    useState<string>("");
  const [expiredDate, setExpiredDate] = useState<Date>();
  const [hasChanges, setHasChanges] = useState(false);
  const [touched, setTouched] = useState({
    platform: false,
  });
  const { platforms } = usePlatforms();
  const [isClicked, setIsClicked] = useState(false);
  const { ls } = useLocalStorage();

  useEffect(() => {
    if (
      (selectedPlatform.length > 0 && platforms.length != 1) ||
      permitNameValue != "" ||
      permitDescriptionValue != "" ||
      expiredDate != undefined
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [
    selectedPlatform,
    permitNameValue,
    permitDescriptionValue,
    platforms,
    expiredDate,
  ]);

  useEffect(() => {}, [isClicked]);

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
    setTouched({
      platform: false,
    });
  };

  const handleConfirmClose = () => {
    setShow(false);
    setShowConfirm(false);
    setSelectedPlatform([]);
    setPermitNameValue("");
    setPermitDescriptionValue("");
    setExpiredDate(undefined);
  };

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  const handleValidSave = () => {
      if (
        selectedPlatform != undefined &&
        permitNameValue != "" &&
        permitDescriptionValue != "" &&
        expiredDate != undefined
      ) {
        handleConfirmClose();
        savePermit();
        setInvalidSave(false);
        setShow(false);
      } else {
        console.log(
          selectedPlatform +
            permitNameValue +
            permitDescriptionValue +
            expiredDate
        );
        setInvalidSave(true);
        setShow(true);

        
      }
     // wait for 2 frames
  };

  const handleCancelSave = () => {
    setInvalidSave(false);
  };

  const handleDateSelect = (
    pickedDates: { minDate: Date; maxDate: Date } | undefined
  ) => {
    if (!pickedDates) {
      setExpiredDate(undefined);
      return;
    }
    const selectedDate = new Date(
      pickedDates.minDate.getFullYear(),
      pickedDates.minDate.getMonth(),
      pickedDates.minDate.getDate()
    );
    setExpiredDate(selectedDate);
  };

  const savePermit = async () => {
    console.log(expiredDate);

    try {
      permit._id = "1";
      permit.platform = selectedPlatform[0];
      permit.permissionName = permitNameValue;
      permit.permissionDescription = permitDescriptionValue;
      permit.permissionOpener = ls.getDisplayName() ?? "";
      permit.status = PermitStatus.Open;
      permit.expirationDate = expiredDate!;
      const response = await connection.addEntity(permit, "Permissions");
      if (response.status === 200 || response.status === 201) {
        console.log("Permit saved successfully");
      } else {
        console.error("Error saving permit:", response.data);
      }
    } catch (error) {
      console.error("Error saving permit:", error);
    }
    console.log(permit);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleShow}
        sx={{
          background: "rgb(114, 156, 240)",
          mb: 1.5,
          ml: 2
        }}
      >
        {t("newPermit")}
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
          {t("newPermit")} ✍
        </DialogTitle>
        <DialogContent>
          <Grid container justifyContent="center" padding={1}>
            <Grid size={12}>
              <Stack spacing={2}>
                <FilterDropdown
                  label={t("choosePlatform")}
                  options={platforms}
                  selected={selectedPlatform}
                  setSelected={setSelectedPlatform}
                  isMultiple={false}
                  width="100%"
                  isReset={false}
                  touched={touched.platform}
                  error={fieldError.platform}
                  onBlur={() => setTouched({ ...touched, platform: true })}
                />

                <DynamicTextField
                  label={t("permitName")}
                  width="100%"
                  onChange={(e) => setPermitNameValue(e.target.value)}
                ></DynamicTextField>
                <DynamicTextField
                  label={t("permitDescription")}
                  width="100%"
                  multiline
                  rows={5}
                  onChange={(e) => setPermitDescriptionValue(e.target.value)}
                ></DynamicTextField>
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Typography
                    sx={{ mt: "1.25rem", ml: "0.3rem", fontWeight: "bold" }}
                  >
                    {t("chooseExpiredDate") + ":"}
                  </Typography>
                  <FullDatePicker
                    invokeCallback={isClicked}
                    pickCallback={handleDateSelect}
                    rangeDate={false}
                    minYear={2019}
                    firstDate={new Date()}
                  />
                </Box>
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
              setIsClicked(!isClicked);
              handleValidSave();
            }}
            variant="contained"
            size="large"
            sx={{
              background: "rgb(114, 156, 240)",
            }}
          >
            {t("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <MissingData
        open={showInvalidSave}
        title={t("missingData")}
        content={t("fillAllFields")}
        onCancel={handleCancelSave}
      />
      <ConfirmedPermit
        open={showConfirmPermit}
        title={t("confirmExit")}
        content={t("areYouSureYouWantToExit")}
      />
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

export default NewPermitModel;
