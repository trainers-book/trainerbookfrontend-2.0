import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  PreservedFlightNameData,
  PlatformData,
  UsersAccountData,
  UsersData,
} from "../../../types/tables/manageTypes";
import EditAccount from "../../edit/editAccount";
import EditUser from "../../edit/editUser";
import EditFlight from "../../edit/editFlight";
import EditPlatform from "../../edit/editPlatform";
import { useBackend } from "../../../context/backendContext";
import { HttpStatusCode } from "axios";
import { useLocalStorage } from "../../../context/localStorageContext";
import ClickedOutside from "../clickedOutside";

interface ManageEditModelProps {
  name: string;
  currentCollection: string;
  manageObject: UsersData | PreservedFlightNameData | PlatformData | UsersAccountData;
  setManageObject: (
    object: UsersData | PreservedFlightNameData | PlatformData | UsersAccountData | null
  ) => void;
  updateData: (value: boolean) => void;
  updatedData: boolean;
  onUpdateSuccess?: () => void;
}

const ManageEditModel: React.FC<ManageEditModelProps> = ({
  name,
  manageObject,
  setManageObject,
  currentCollection,
  updateData,
  updatedData,
  onUpdateSuccess,
}) => {
  const { t } = useTranslation();
  const { connection } = useBackend();
  const { ls } = useLocalStorage();
  const [submitChanges, setSubmitChanges] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [editedData, setEditedData] = useState<any>(manageObject);

  const loginAs = (user: UsersAccountData) => {
    const adminLoginDetails = {
      platforms: ls.getPlatforms(),
      authorization: ls.getAuthorization(),
      userName: ls.getUserName(),
      displayName: ls.getDisplayName(),
      isAuthenticated: ls.getIsAuthenticated(),
    };

    ls.clear();
    ls.setPlatforms(user.platforms);
    ls.setAuthorization(user.role);
    ls.setDisplayName(user.firstName + " " + user.lastName);
    ls.setUserName(user.personalNumber);
    ls.setIsAuthenticated("true");
    ls.setAdminLogin(adminLoginDetails);
    window.location.reload();
  };

  const sendDataToUpdate = async (
    data: UsersAccountData | UsersData | PreservedFlightNameData | PlatformData,
  ) => {
    if (data.isEqual(manageObject)) {
      return;
    }

    let dataToDb;
    let updateResponse: { status: number; data?: unknown } | undefined;

    if (data instanceof UsersAccountData) {
      dataToDb = {
        _id: data.personalNumber.slice(1, data.personalNumber.length),
        lastId: data.id,
        userName: data.personalNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        authenticationLevel: data.role,
        platform: data.platforms,
        password: data.password,
      };

      if (data.role == currentCollection) {
        updateResponse = await connection.updateAccount(
          currentCollection,
          dataToDb
        );
      } else {
        updateResponse = await connection.updateAccountRole(
          currentCollection,
          data.role,
          dataToDb
        );
      }
    } else if (data instanceof UsersData) {
      dataToDb = {
        _id: data.personalNumber,
        lastId: manageObject.personalNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        platform: data.platforms,
        name: data.firstName + " " + data.lastName,
      };

      updateResponse = await connection.updateEntity(
        currentCollection,
        dataToDb
      );
    } else if (data instanceof PreservedFlightNameData) {
      dataToDb = {
        _id: data._id,
        name: manageObject.name,
        platform: data.platform,
        date: data.date.getTime(),
      };
      updateResponse = await connection.updateEntity(
        "PreservedFlightNames",
        dataToDb
      );
    } else if (data instanceof PlatformData) {
      dataToDb = {
        _id: data._id,
        name: data.name,
      };
      updateResponse = await connection.updateEntity(
        currentCollection,
        dataToDb
      );
    }

    if (updateResponse && updateResponse.status == HttpStatusCode.Ok) {
      onUpdateSuccess?.();
      updateData(!updatedData);
      setManageObject(null);
    }
  };

  const handleSave = () => {
    sendDataToUpdate(editedData)
  };

  const handleClose = () => {
    if (editedData.isEqual(manageObject)) {
      setManageObject(null);
      setSubmitChanges(false);
    } else {
      setShowConfirmClose(true); 
    }
  };

  const handleCancelClose = () => {
    setShowConfirmClose(false);
  };

  const handleConfirmClose = () => {
    setShowConfirmClose(false);
    setManageObject(null);
    setSubmitChanges(false);
  };

  return (
    <>
      <Dialog
        open={true}
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
          {manageObject instanceof UsersAccountData && (
            <Tooltip title="login as" arrow>
              <IconButton
                onClick={() => {
                  loginAs(manageObject as UsersAccountData);
                }}
                sx={{ position: "absolute", left: 8, top: 8 }}
              >
                <ArrowDownwardIcon />
              </IconButton>
            </Tooltip>
          )}
          <Box component="div" sx={{ textAlign: "center", mt: 1 }}>
            <Box component="h4" sx={{ margin: 0 }}>
            {t("changeDetails")} - {t(name)}
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ m: 2 }}>
          <Box sx={{ pt: 1 }}>
            {manageObject instanceof UsersAccountData && (
              <EditAccount
                accountData={manageObject}
                invokeCallback={submitChanges}
                objectCallback={sendDataToUpdate}
              />
            )}
            {manageObject instanceof UsersData &&
              !(manageObject instanceof UsersAccountData) && (
                <EditUser
                  userData={manageObject}
                  invokeCallback={submitChanges}
                  objectCallback={sendDataToUpdate}
                />
              )}
            {manageObject instanceof PreservedFlightNameData && (
              <EditFlight
                preservedFlightNameData={manageObject}
                invokeCallback={submitChanges}
                objectCallback={sendDataToUpdate}
              />
            )}
            {manageObject instanceof PlatformData && (
              <EditPlatform
                platformData={manageObject}
                objectCallback={setEditedData}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            type="button"
            onClick={handleSave}
            variant="contained"
            sx={{ background: "rgb(114, 156, 240)" }}
          >
            {t("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <ClickedOutside
        open={showConfirmClose}
        onCancel={handleCancelClose}
        onConfirm={handleConfirmClose}
        title={t("confirmExit")}
        content={t("areYouSureYouWantToExit")}
      />
    </>
  );
};

export default ManageEditModel;
