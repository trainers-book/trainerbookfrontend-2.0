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
  AlertColor,
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
import {
  CollectionIds,
  useBackend,
} from "../../../context/backendContext";
import MissingData from "../missingData";
import CustomAlert from "../../Dynamics/CustomAlert";
import { HttpStatusCode } from "axios";
import PermitData, {
  PermitObjectFromFetch,
} from "../../../types/tables/permits";

interface NewPermitModelProps {
  onSave?: (permit: PermitData) => void;
}

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

const NewPermitModel: React.FC<NewPermitModelProps> = ({ onSave }) => {
  const { connection } = useBackend();
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInvalidSave, setInvalidSave] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  const { t } = useTranslation();
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [permitNameValue, setPermitNameValue] = useState<string>("");
  const [permitDescriptionValue, setPermitDescriptionValue] =
    useState<string>("");
  const [expiredDate, setExpiredDate] = useState<Date>();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
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
    setPendingSave(true);
    setIsClicked((prev) => !prev);

    window.setTimeout(() => {
      setPendingSave((stillPending) => {
        if (stillPending) {
          savePermit(expiredDate);
        }

        return false;
      });
    }, 50);
  };

  const handleCancelSave = () => {
    setInvalidSave(false);
  };

  const handleDateSelect = (
    pickedDates: { minDate: Date; maxDate: Date } | undefined,
  ) => {
    if (!pickedDates) {
      setExpiredDate(undefined);
      return;
    }

    const selectedDate = new Date(
      pickedDates.minDate.getFullYear(),
      pickedDates.minDate.getMonth(),
      pickedDates.minDate.getDate(),
    );
    setExpiredDate(selectedDate);

    if (pendingSave) {
      setPendingSave(false);
      savePermit(selectedDate);
    }
  };

  const resetForm = () => {
    setSelectedPlatform([]);
    setPermitNameValue("");
    setPermitDescriptionValue("");
    setExpiredDate(undefined);
    setHasChanges(false);
  };

  const fetchNextPermitId = async () => {
    const response = await connection.getNextId(CollectionIds.PERMIT_ID);

    if (response.status === HttpStatusCode.Ok) {
      const seq = Number(response.data?.[0]?.sequenceValue);
      if (!Number.isNaN(seq)) {
        return seq;
      }
    }

    const permits = await connection.getAllEntities("Permissions");
    if (permits.status === HttpStatusCode.Ok && Array.isArray(permits.data)) {
      return (
        Math.max(
          0,
          ...permits.data.map((savedPermit: any) => Number(savedPermit._id) || 0),
        ) + 1
      );
    }

    return Date.now();
  };

  const savePermit = async (selectedExpiredDate = expiredDate) => {
    if (
      selectedPlatform.length === 0 ||
      permitNameValue.trim() === "" ||
      permitDescriptionValue.trim() === "" ||
      selectedExpiredDate === undefined
    ) {
      setInvalidSave(true);
      setShow(true);
      return;
    }

    try {
      const permitId = await fetchNextPermitId();
      const permitToSave = {
        ...permit,
        _id: permitId,
        platform: selectedPlatform[0],
        permissionName: permitNameValue,
        permissionDescription: permitDescriptionValue,
        permissionOpener: ls.getDisplayName(),
        openingDate: new Date(),
        status: PermitStatus.Open,
        expirationDate: selectedExpiredDate,
      };
      const response = await connection.addEntity(permitToSave, "Permissions");

      if (
        response.status === HttpStatusCode.Ok ||
        response.status === HttpStatusCode.Created
      ) {
        const responsePermit = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        const savedPermit = PermitObjectFromFetch({
          ...permitToSave,
          ...(responsePermit ?? {}),
          _id: responsePermit?._id ?? permitToSave._id,
          openingDate: responsePermit?.openingDate ?? permitToSave.openingDate,
        } as any);
        setInvalidSave(false);
        setShow(false);
        setShowConfirm(false);
        resetForm();
        onSave?.(savedPermit);
        setAlertSeverity("success");
        setAlertMessage(t("saveSuccessful"));
        setAlertOpen(true);
      } else {
        setAlertSeverity("error");
        setAlertMessage(t("saveFailed"));
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(t("saveFailed"));
      setAlertOpen(true);
    }
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
          {t("newPermit")} 
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
                    maxYear={new Date().getFullYear() + 1}
                    minDate={new Date()}
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
            onClick={handleValidSave}
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

export default NewPermitModel;
