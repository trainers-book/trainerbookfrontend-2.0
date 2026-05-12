import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  API_Pathes,
  CollectionIds,
  useBackend,
} from "../../../context/backendContext";
import { PlatformData } from "../../../types/tables/manageTypes";
import { HttpStatusCode } from "axios";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterSearchBar from "../../Dynamics/filterSearchBar";
import ClickedOutside from "../clickedOutside";

type NewPlatformType = {
  open: boolean;
  onClose: (closed: boolean) => void;
  callback: (platform: PlatformData) => void;
};

const NewPlatform: React.FC<NewPlatformType> = ({
  open,
  onClose,
  callback,
}) => {
  const { t } = useTranslation();
  const { connection } = useBackend();
  const [showConfirm, setShowConfirm] = useState(false);
  const [platformNameVal, setPlatformNameVal] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const [selectableField, setSelectableField] = useState<any>([]);
  const [selectableFieldChecked, setSelectableFieldChecked] = useState<
    boolean[]
  >([]);
  const [selectableFieldCheckedIndex, setSelectableFieldCheckedIndex] =
    useState<number[]>([]);

  (useEffect(() => {
    setHasChanges(
      platformNameVal === "" &&
        selectableFieldChecked.some((checked) => checked),
    );
  }),
    [platformNameVal, selectableFieldChecked]);

  useEffect(() => {
    getSelectableFields();
  });

  useEffect(() => {
    if (selectableField.length > 0) {
      setSelectableFieldChecked(Array(selectableField.length).fill(false));
    }
  }, [selectableField]);

  useEffect(() => {
    handleCheckedBoxIndex();
  }, [selectableFieldChecked]);

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirm(true);
    } else {
      if (platformNameVal !== "") {
        addPlatformToShowFor();
        createPlatform();
      }
      onClose(true);
      setShowConfirm(false);
      setPlatformNameVal("");
      setSelectableFieldChecked(Array(selectableField.length).fill(false));
    }
  };

  const handleConfirmClose = () => {
    onClose(true);
    setShowConfirm(false);
    setPlatformNameVal("");
    setSelectableField([]);
    setSelectableFieldChecked(Array(selectableField.length).fill(false));
  };

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  const addPlatformToShowFor = async () => {
    await connection.addPlatformToShowFor(API_Pathes.NEW_FLIGHTS_FIELDS, {
      ids: selectableFieldCheckedIndex,
      updates: { showFor: platformNameVal },
    });
  };

  const getSelectableFields = async () => {
    if (selectableField.length === 0) {
      const data = await connection.getAllEntities(
        API_Pathes.NEW_FLIGHTS_FIELDS,
      );

      if (data.status === HttpStatusCode.Ok) {
        setSelectableField(data.data);
      }
    }
  };

  const handleCheckedBoxChange = (index: number) => {
    const updatedCheckedState = [...selectableFieldChecked];
    updatedCheckedState[index] = !updatedCheckedState[index];
    setSelectableFieldChecked(updatedCheckedState);
  };

  const handleCheckedBoxIndex = () => {
    let indexArray = [];

    for (let box = 0; box < selectableFieldChecked.length; box++) {
      if (selectableFieldChecked[box]) {
        indexArray.push(box + 1);
      }
    }

    setSelectableFieldCheckedIndex(indexArray);
  };

  const getPlatformId = async () => {
    const id = await connection.getNextId(CollectionIds.AIRCRAFT_ID);

    if (id.status !== HttpStatusCode.InternalServerError) {
      return id.data[0].sequenceValue;
    } else {
      return -1;
    }
  };

  const createPlatform = async () => {
    const id = await getPlatformId();

    if (id === -1) {
      return;
    } else {
      callback(new PlatformData(platformNameVal, id));
    }
  };
   
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, padding: 2 } } }}
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
          {t("newPlatform")}
        </DialogTitle>

        <DialogContent>
          <Grid container justifyContent={"center"} padding={1}>
            <Grid size={12}>
              <Stack sx={{ mr: 4 }}>
                <FilterSearchBar
                  width="30rem"
                  label={t("platformName")}
                  setSearch={setPlatformNameVal}
                  isReset={false}
                />
              </Stack>
              <Stack sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {selectableField.map((field: any, index: number) => (
                    <Box sx={{ width: "calc(33% - 10px)" }}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectableFieldChecked[index]}
                              onChange={() => handleCheckedBoxChange(index)}
                            />
                          }
                          label={field.display}
                        />
                      </FormGroup>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleClose}
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
      ></ClickedOutside>
    </>
  );
};

export default NewPlatform;
