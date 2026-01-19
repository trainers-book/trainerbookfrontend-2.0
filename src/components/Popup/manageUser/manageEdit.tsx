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
  FlightData,
  platformData,
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

interface ManageEditModelProps {
  name: string;
  currentCollection: string;
  manageObject: UsersData | FlightData | platformData | UsersAccountData;
  setManageObject: (
    object: UsersData | FlightData | platformData | UsersAccountData | null
  ) => void;
  updateData: (value: boolean) => void;
  updatedData: boolean;
}

const ManageEditModel: React.FC<ManageEditModelProps> = ({
  name,
  manageObject,
  setManageObject,
  currentCollection,
  updateData,
  updatedData,
}) => {
  const { t } = useTranslation();
  const { connection } = useBackend();
  const { ls } = useLocalStorage()
  const [submitChanges, setSubmitChanges] = useState(false);

  const loginAs = (user: UsersAccountData) => {    
    ls.clear();
    ls.setPlatforms(user.platforms);
    ls.setAuthorization(user.role);
    ls.setDisplayName(user.firstName + " " + user.lastName);
    ls.setUserName(user.personalNumber);
    ls.setIsAuthenticated("true");
    window.location.reload();
  };

  return (
    <>
      <Dialog
        open={true}
        onClose={() => setManageObject(null)}
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
            onClick={() => {
              setManageObject(null);
            }}
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
          <DialogTitle align="center" variant="h4">
            {t("changeDetails")} - {t(name)}
          </DialogTitle>
        </DialogTitle>

        <DialogContent sx={{ m: 2 }}>
          <Box sx={{ pt: 1 }}>
            {manageObject instanceof UsersAccountData && (
              <EditAccount
                accountData={manageObject}
                invokeCallback={submitChanges}
                objectCallback={async (data: UsersAccountData) => {
                  if (!data.isEqual(manageObject)) {
                    let updateResponse;
                    if (data.role == currentCollection) {
                      updateResponse = await connection.updateAccount(
                        currentCollection,
                        {
                          _id: data.personalNumber.slice(
                            1,
                            data.personalNumber.length
                          ),
                          lastId: data.id,
                          userName: data.personalNumber,
                          firstName: data.firstName,
                          lastName: data.lastName,
                          authenticationLevel: data.role,
                          platform: data.platforms,
                          password: data.password,
                        }
                      );
                    } else {
                      updateResponse = await connection.updateAccountRole(
                        currentCollection,
                        data.role,
                        {
                          _id: data.personalNumber.slice(
                            1,
                            data.personalNumber.length
                          ),
                          lastId: data.id,
                          userName: data.personalNumber,
                          firstName: data.firstName,
                          lastName: data.lastName,
                          authenticationLevel: data.role,
                          platform: data.platforms,
                          password: data.password,
                        }
                      );
                    }

                    if (updateResponse.status == HttpStatusCode.Ok) {
                      updateData(!updatedData);
                      setManageObject(null);
                    }
                  }
                }}
              />
            )}
            {manageObject instanceof UsersData &&
              !(manageObject instanceof UsersAccountData) && (
                <EditUser
                  userData={manageObject}
                  invokeCallback={submitChanges}
                  objectCallback={async (data: UsersData) => {
                    if (!data.isEqual(manageObject)) {
                      const updateResponse = await connection.updateEntity(
                        currentCollection,
                        {
                          _id: data.personalNumber,
                          lastId: manageObject.personalNumber,
                          firstName: data.firstName,
                          lastName: data.lastName,
                          platform: data.platforms,
                          name: data.firstName + " " + data.lastName,
                        }
                      );

                      if (updateResponse.status == HttpStatusCode.Ok) {
                        updateData(!updatedData);
                        setManageObject(null);
                      }
                    }
                  }}
                />
              )}
            {manageObject instanceof FlightData && (
              <EditFlight
                flightData={manageObject}
                invokeCallback={submitChanges}
                objectCallback={async (data: FlightData) => {
                  console.log(currentCollection);

                  if (!data.isEqual(manageObject)) {
                    const updateResponse = await connection.updateEntity(
                      "PreservedFlightNames",
                      {
                        _id: data._id,
                        name: manageObject.name,
                        platform: data.platform,
                        date: data.date.getTime(),
                      }
                    );

                    if (updateResponse.status == HttpStatusCode.Ok) {
                      updateData(!updatedData);
                      setManageObject(null);
                    }
                  }
                }}
              />
            )}
            {manageObject instanceof platformData && (
              <EditPlatform
                platformData={manageObject}
                invokeCallback={submitChanges}
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
            onClick={() => {
              setSubmitChanges(!submitChanges);
              // setManageObject(null);
            }}
            variant="contained"
            sx={{ background: "rgb(114, 156, 240)" }}
          >
            {t("save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageEditModel;
