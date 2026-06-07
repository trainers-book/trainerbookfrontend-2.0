import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  AlertColor,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { API_Pathes, useBackend } from "../../../context/backendContext";
import CustomAlert from "../../Dynamics/CustomAlert";
import FilterDropdown from "../../Dynamics/filterDropdown";
import FilterSearchBar from "../../Dynamics/filterSearchBar";
import FilterDateTime from "../../Dynamics/filterDateTime";
import { Status } from "../../../types/statuses";
import { Severity } from "../../../types/issuesSeverity";
import { HttpStatusCode } from "axios";
import { usePlatforms } from "../../../context/platformsContext";
import { VerifiedEnum } from "../../../types/verify";

interface IssueInformationProps {
  isOpen: boolean;
  selectedRow: any;
  onClose: () => void;
  onSave?: (updatedRow: any) => void;
}

const EXCLUDE_FIELDS = new Set(["_id", "createdAt", "updatedAt"]);
const DATE_FIELDS = new Set(["dateTime", "closedTime", "_closedTime"]);
const SELECT_FIELDS = new Set([
  "status",
  "issueSeverity",
  "flightName",
  "issueOpener",
  "malfSystem",
  "_malfSystem",
  "_malfClassification",
]);

const EXTRA_FIELDS = [
  "goTime",
  "_isVerified",
  "_isAirborneComponent",
  "_malfClassification",
];

const OTHER_MALF_SYSTEM = "אחר";
const OTHER_MALF_SYSTEM_LABEL = "מערכת תקלה אחר";
const AIRBORNE_COMPONENT_LABEL = "תקלה במכלול מוטס";
const MALF_CLASSIFICATION_OPTIONS = ["חומרה", "תוכנה", "הנדסה"];

const IssueInformation: React.FC<IssueInformationProps> = ({
  isOpen,
  selectedRow,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const { connection } = useBackend();
  const { platforms } = usePlatforms();
  const [formValues, setFormValues] = useState<any>(selectedRow);
  const [initialValues, setInitialValues] = useState<any>(undefined);
  const [originalKeys, setOriginalKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [flightOptions, setFlightOptions] = useState<string[]>([]);
  const [issueOpenerOptions, setIssueOpenerOptions] = useState<string[]>([]);
  const [malfSystemOptions, setMalfSystemOptions] = useState<string[]>([]);
  const [isOtherMalfSystem, setIsOtherMalfSystem] = useState(false);
  const [customMalfSystem, setCustomMalfSystem] = useState("");

  useEffect(() => {
    loadRaw();
  }, [selectedRow]);

  useEffect(() => {
    loadOptions();
  }, [formValues?.platform, connection]);

  useEffect(() => {
    const loadMalfSystems = async () => {
      if (!connection) return;
      try {
        const res = await connection.getAllEntities("MalfunctionedSystems");
        if (
          res &&
          res.status === HttpStatusCode.Ok &&
          Array.isArray(res.data)
        ) {
          const opts = res.data.map((val: any) =>
            val && typeof val === "object"
              ? (val.name ?? val.value ?? val)
              : val,
          );
          setMalfSystemOptions(opts);
          return;
        }
      } catch (e) {
        // ignore
      }
      setMalfSystemOptions([]);
    };

    loadMalfSystems();
  }, [connection]);

  useEffect(() => {
    if (!formValues) return;

    const currentSystem = formValues._malfSystem ?? formValues.malfSystem;
    const isCustom =
      Boolean(currentSystem) &&
      malfSystemOptions.length > 0 &&
      !malfSystemOptions.includes(currentSystem);
    setIsOtherMalfSystem(isCustom || currentSystem === OTHER_MALF_SYSTEM);
  }, [formValues?._malfSystem, formValues?.malfSystem, malfSystemOptions]);

  useEffect(() => {
    if (!formValues) return;

    setFormValues((prev: any) => {
      const next = { ...prev };

      if (flightOptions.length === 1 && !next.flightName) {
        next.flightName = flightOptions[0];
      }
      if (issueOpenerOptions.length === 1 && !next.issueOpener) {
        next.issueOpener = issueOpenerOptions[0];
      }

      return next;
    });
  }, [flightOptions, issueOpenerOptions]);

  const loadRaw = async () => {
    const getVisibleOriginalKeys = (issue: any) =>
      Array.from(new Set([...Object.keys(issue), ...EXTRA_FIELDS]));

    if (!selectedRow) {
      setFormValues(undefined);
      setOriginalKeys([]);
      return;
    }

    const all = await connection.getAllEntities(API_Pathes.FLIGHT_FAILURE);
    if (all && all.status === 200 && Array.isArray(all.data)) {
      const found = all.data.find(
        (item: any) =>
          item._id === selectedRow._id ||
          item.issueNumber === selectedRow.issueNumber
      );
      if (found) {
        // Normalize status: convert English enum keys back to Hebrew values for display
        if (
          found.status &&
          typeof found.status === "string" &&
          found.status in Status
        ) {
          found.status = (Status as any)[found.status];
        }
        if (
          found.failureStatus &&
          typeof found.failureStatus === "string" &&
          found.failureStatus in Status
        ) {
          found.failureStatus = (Status as any)[found.failureStatus];
        }
        if (
          found.issueSeverity &&
          typeof found.issueSeverity === "string" &&
          found.issueSeverity in Severity
        ) {
          found.issueSeverity = (Severity as any)[found.issueSeverity];
        }
        // Normalize DB's isVerified/_isVerified into the _isVerified display field
        const rawVerified =
          found._isVerified !== undefined
            ? found._isVerified
            : found.isVerified;
        if (rawVerified !== undefined) {
          found._isVerified =
            rawVerified === true ||
            rawVerified === "כן" ||
            rawVerified === "true" ||
            rawVerified === 1
              ? VerifiedEnum.Verified
              : VerifiedEnum.NotVerified;
        } else {
          found._isVerified = VerifiedEnum.NotVerified;
        }
        delete found.isVerified;
        if (found.isAirborneComponent !== undefined) {
          found._isAirborneComponent = found.isAirborneComponent;
          delete found.isAirborneComponent;
        }
        if (found.malfClassification !== undefined) {
          found._malfClassification = found.malfClassification;
          delete found.malfClassification;
        }
        if (found.goTime === undefined) {
          found.goTime = 0;
        }
        setFormValues({ ...found });
        setInitialValues({ ...found });
        setOriginalKeys(getVisibleOriginalKeys(found));
        return;
      }
    }

    // fallback: use the provided row (may have defaults)
    // Normalize status if it's an English enum key for display
    const normalized = { ...selectedRow };
    if (
      normalized.status &&
      typeof normalized.status === "string" &&
      normalized.status in Status
    ) {
      normalized.status = (Status as any)[normalized.status];
    }
    if (
      normalized.failureStatus &&
      typeof normalized.failureStatus === "string" &&
      normalized.failureStatus in Status
    ) {
      normalized.failureStatus = (Status as any)[normalized.failureStatus];
    }
    if (
      normalized.issueSeverity &&
      typeof normalized.issueSeverity === "string" &&
      normalized.issueSeverity in Severity
    ) {
      normalized.issueSeverity = (Severity as any)[normalized.issueSeverity];
    }
    // Normalize DB's isVerified/_isVerified into the _isVerified display field
    const rawVerified =
      normalized._isVerified !== undefined
        ? normalized._isVerified
        : normalized.isVerified;
    if (rawVerified !== undefined) {
      normalized._isVerified =
        rawVerified === true ||
        rawVerified === "כן" ||
        rawVerified === "true" ||
        rawVerified === 1
          ? VerifiedEnum.Verified
          : VerifiedEnum.NotVerified;
    } else {
      normalized._isVerified = VerifiedEnum.NotVerified;
    }
    delete normalized.isVerified;
    if (normalized.isAirborneComponent !== undefined) {
      normalized._isAirborneComponent = normalized.isAirborneComponent;
      delete normalized.isAirborneComponent;
    }
    if (normalized.malfClassification !== undefined) {
      normalized._malfClassification = normalized.malfClassification;
      delete normalized.malfClassification;
    }
    if (normalized.goTime === undefined) {
      normalized.goTime = 0;
    }
    setFormValues(normalized);
    setInitialValues(normalized);
    setOriginalKeys(getVisibleOriginalKeys(normalized));
  };

  const loadOptions = async () => {
    if (!formValues?.platform) {
      setFlightOptions([]);
      setIssueOpenerOptions([]);
      return;
    }

    const platformValue = formValues.platform;

    const preservedFlights = await connection.getAllEntities(
      API_Pathes.PRESERVED_FLIGHT_NAME,
    );

    if (preservedFlights.status === HttpStatusCode.Ok) {
      const filteredFlights = preservedFlights.data
        .filter((flight: any) => flight.platform === platformValue)
        .map((flight: any) => flight.name);
      setFlightOptions(Array.from(new Set(filteredFlights)));
    } else {
      setFlightOptions([]);
    }

    const roleResponses = await Promise.all([
      connection.getAllEntities(API_Pathes.INSTRUCTOR),
      connection.getAllEntities(API_Pathes.PILOT),
      connection.getAllEntities(API_Pathes.TECHNICIAN),
    ]);

    const openerOptions = roleResponses.flatMap((res) => {
      if (res.status !== HttpStatusCode.Ok || !Array.isArray(res.data)) {
        return [];
      }

      return res.data
        .filter((person: any) => {
          const personPlatforms = person.platform ?? person.platforms ?? [];
          return Array.isArray(personPlatforms)
            ? personPlatforms.includes(platformValue)
            : String(personPlatforms).includes(platformValue);
        })
        .map((person: any) => person.name)
        .filter(Boolean);
    });

    setIssueOpenerOptions(Array.from(new Set(openerOptions)));
  };

  const formatDateTime = (value: any) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const normalizeSeconds = (value: any) => {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string") {
      if (value.includes(":")) {
        const [hours = "0", minutes = "0", seconds = "0"] = value.split(":");
        return (
          Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
        );
      }
      const parsed = Number(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const getDurationParts = (value: any) => {
    const totalSeconds = Math.max(0, normalizeSeconds(value));
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  };

  const setDurationPart = (
    currentValue: any,
    part: "hours" | "minutes" | "seconds",
    value: string,
  ) => {
    const current = getDurationParts(currentValue);
    const parsed = Math.max(0, Number(value) || 0);
    const next = {
      ...current,
      [part]: part === "hours" ? parsed : Math.min(parsed, 59),
    };
    return next.hours * 3600 + next.minutes * 60 + next.seconds;
  };

  const isChecked = (value: any) =>
    value === true ||
    value === "true" ||
    value === "כן" ||
    value === "1" ||
    value === 1 ||
    value === VerifiedEnum.Verified;

  const handleChange = (key: string, value: any) => {
    setFormValues((prev: any) => ({ ...prev, [key]: value }));
  };

  const areValuesEqual = (a: any, b: any) => {
    if (a === b) return true;
    if (a instanceof Date && b instanceof Date)
      return a.getTime() === b.getTime();
    if (Array.isArray(a) && Array.isArray(b)) {
      return (
        a.length === b.length && a.every((item, index) => item === b[index])
      );
    }
    return false;
  };

  const isFormDirty = useMemo(() => {
    if (!initialValues || !formValues) return false;
    const keys = Array.from(
      new Set([...Object.keys(initialValues), ...Object.keys(formValues)]),
    );
    return keys.some(
      (key) => !areValuesEqual(initialValues[key], formValues[key]),
    );
  }, [formValues, initialValues]);

  const normalizeSelectValue = (key: string, value: any) => {
    if (key === "_isVerified") {
      if (
        value === true ||
        value === "true" ||
        value === "כן" ||
        value === 1 ||
        value === "1"
      ) {
        return VerifiedEnum.Verified;
      }
      if (
        value === false ||
        value === "false" ||
        value === "לא" ||
        value === 0 ||
        value === "0"
      ) {
        return VerifiedEnum.NotVerified;
      }
      if (value === VerifiedEnum.Verified || value === VerifiedEnum.NotVerified)
        return value;
      return "";
    }
    return value ?? "";
  };

  const getOptions = (
    key: string,
  ): Array<string | { value: string; label: string }> => {
    switch (key) {
      case "status":
        return Object.values(Status);
      case "issueSeverity":
        return Object.values(Severity);
      case "platform":
        return platforms;
      case "flightName":
        return flightOptions;
      case "issueOpener":
        return issueOpenerOptions;
      case "malfSystem":
      case "_malfSystem":
        return malfSystemOptions;
      case "_malfClassification":
        return MALF_CLASSIFICATION_OPTIONS;
      default:
        return [];
    }
  };

  // Render only the keys that were present on the original selected row
  // (prevents locally-added default fields from appearing until saved)
  const visibleKeys = formValues
    ? originalKeys.filter((key) => !EXCLUDE_FIELDS.has(key))
    : [];

  const saveChanges = async () => {
    if (!formValues) return;
    const body = { ...formValues };

    if (body.dateTime) {
      body.dateTime =
        body.dateTime instanceof Date
          ? body.dateTime.getTime()
          : new Date(body.dateTime).getTime();
    }
    if (body._closedTime) {
      body._closedTime =
        body._closedTime instanceof Date
          ? body._closedTime.getTime()
          : new Date(body._closedTime).getTime();
    }
    if (!body._id && body.issueNumber !== undefined) {
      body._id = body.issueNumber;
    }

    // Map Hebrew status values to English enum keys for backend
    const mapStatusToEnum = (val: any) => {
      if (!val) return Status.Active;

      const enumValue = Object.keys(Status).find(
        (key) => (Status as any)[key] === val,
      );
      return enumValue ?? val;
    };

    const mapSeverityToEnum = (val: any) => {
      if (!val) return Severity.Low;

      const enumValue = Object.keys(Severity).find(
        (key) => (Severity as any)[key] === val,
      );
      return enumValue ?? val;
    };

    const bodyToSend = { ...body };
    if (bodyToSend.status) {
      bodyToSend.status = mapStatusToEnum(bodyToSend.status);
    } else if (bodyToSend.failureStatus) {
      bodyToSend.failureStatus = mapStatusToEnum(bodyToSend.failureStatus);
    }
    if (bodyToSend.issueSeverity) {
      bodyToSend.issueSeverity = mapSeverityToEnum(bodyToSend.issueSeverity);
    }

    if (bodyToSend._isVerified !== undefined) {
      bodyToSend.isVerified = bodyToSend._isVerified === VerifiedEnum.Verified;
      delete bodyToSend._isVerified;
    }
    if (bodyToSend._isAirborneComponent !== undefined) {
      bodyToSend.isAirborneComponent = Boolean(
        bodyToSend._isAirborneComponent,
      );
      delete bodyToSend._isAirborneComponent;
    }
    if (bodyToSend._malfSystem !== undefined) {
      bodyToSend.malfSystem =
        bodyToSend._malfSystem === OTHER_MALF_SYSTEM
          ? customMalfSystem
          : bodyToSend._malfSystem;
      delete bodyToSend._malfSystem;
    }
    if (bodyToSend.malfSystem === OTHER_MALF_SYSTEM) {
      bodyToSend.malfSystem = customMalfSystem;
    }
    if (bodyToSend._malfClassification !== undefined) {
      bodyToSend.malfClassification = bodyToSend._malfClassification;
      delete bodyToSend._malfClassification;
    }
    if (bodyToSend._closedTime !== undefined) {
      bodyToSend.closedTime = bodyToSend._closedTime;
      delete bodyToSend._closedTime;
    }
    if (bodyToSend.goTime !== undefined) {
      bodyToSend.goTime = normalizeSeconds(bodyToSend.goTime);
    }

    setLoading(true);

    const update = await connection.updateEntity("FlightFailure", bodyToSend);
    if (update && update.status === HttpStatusCode.Ok) {
      setAlertSeverity("success");
      setAlertMessage(t("saveSuccessful"));
      setAlertOpen(true);
      setTimeout(() => {
        // Use server response, or fallback to original body (with Hebrew values)
        onSave?.(update.data ?? body);
        onClose();
      }, 700);
    } else {
      setAlertSeverity("error");
      setAlertMessage(t("saveFailed"));
      setAlertOpen(true);
    }

    setLoading(false);
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  if (!formValues) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogContent sx={{ backgroundColor: "background.default", p: 3 }}>
        <Box
          sx={{
            position: "relative",
            backgroundColor: "background.paper",
            borderRadius: 3,
            p: 3,
            boxShadow: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
            }}
          >
            {visibleKeys.map((key) => {
              const value = formValues[key];
              const isDate = DATE_FIELDS.has(key);
              const isSelect = SELECT_FIELDS.has(key);
              const inputValue = isDate ? formatDateTime(value) : (value ?? "");
              const label = t(key.replace(/^_+/, ""));
              const isFullWidth =
                key === "issueDescription" ||
                key === "goTime" ||
                key === "_isVerified" ||
                key === "_isAirborneComponent" ||
                key === "malfSystem" ||
                key === "_malfSystem";
              const editable = key !== "issueNumber" && key !== "platform";

              let options = getOptions(key);
              if (key === "malfSystem" || key === "_malfSystem") {
                options = [
                  ...malfSystemOptions.map((opt) =>
                    typeof opt === "string" ? { value: opt, label: opt } : opt,
                  ),
                  { value: OTHER_MALF_SYSTEM, label: OTHER_MALF_SYSTEM },
                ];
              }

              const selectValue =
                (key === "malfSystem" || key === "_malfSystem") &&
                isOtherMalfSystem
                  ? OTHER_MALF_SYSTEM
                  : normalizeSelectValue(key, value);

              const hasValue = options.some((opt) =>
                typeof opt === "string"
                  ? opt === selectValue
                  : opt.value === selectValue,
              );
              const finalOptions = hasValue
                ? options
                : selectValue
                  ? [{ value: selectValue, label: selectValue }, ...options]
                  : options;

              return (
                <Box
                  key={key}
                  sx={{
                    gridColumn: isFullWidth ? "1 / -1" : undefined,
                  }}
                >
                  {key === "_isVerified" ? (
                    <Box>
                      <Typography sx={{ mb: 0.5 }}>{label}</Typography>
                      <Box sx={{ display: "flex", gap: 3 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={value === VerifiedEnum.Verified}
                              onChange={(event) =>
                                handleChange(
                                  key,
                                  event.target.checked
                                    ? VerifiedEnum.Verified
                                    : VerifiedEnum.NotVerified,
                                )
                              }
                              disabled={!editable}
                            />
                          }
                          label={t("yes")}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={value === VerifiedEnum.NotVerified}
                              onChange={(event) =>
                                handleChange(
                                  key,
                                  event.target.checked
                                    ? VerifiedEnum.NotVerified
                                    : VerifiedEnum.Verified,
                                )
                              }
                              disabled={!editable}
                            />
                          }
                          label={t("no")}
                        />
                      </Box>
                    </Box>
                  ) : key === "_isAirborneComponent" ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isChecked(value)}
                          onChange={(event) =>
                            handleChange(key, event.target.checked)
                          }
                          disabled={!editable}
                        />
                      }
                      label={AIRBORNE_COMPONENT_LABEL}
                    />
                  ) : key === "goTime" ? (
                    <Box>
                      <Typography sx={{ mb: 0.5 }}>זמן תקלה</Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.75,
                          alignItems: "center",
                          direction: "ltr",
                          justifyContent: "flex-end",
                        }}
                      >
                        {(["hours", "minutes", "seconds"] as const).map(
                          (part, index) => {
                            const duration = getDurationParts(value);
                            return (
                              <React.Fragment key={part}>
                                {index > 0 && (
                                  <Typography sx={{ fontWeight: 700 }}>
                                    :
                                  </Typography>
                                )}
                                <TextField
                                  type="number"
                                  value={duration[part]}
                                  onChange={(event) =>
                                    handleChange(
                                      key,
                                      setDurationPart(
                                        value,
                                        part,
                                        event.target.value,
                                      ),
                                    )
                                  }
                                  disabled={!editable}
                                  slotProps={{
                                    htmlInput: {
                                      min: 0,
                                      max: part === "hours" ? undefined : 59,
                                      step: 1,
                                    },
                                  }}
                                  sx={{
                                    width: "6rem",
                                    "& .MuiInputBase-root": { borderRadius: 2 },
                                    "& .MuiInputBase-input": {
                                      padding: "6.5px",
                                      textAlign: "center",
                                    },
                                  }}
                                />
                              </React.Fragment>
                            );
                          },
                        )}
                      </Box>
                    </Box>
                  ) : key === "malfSystem" || key === "_malfSystem" ? (
                    <Box
                      sx={{
                        display: "grid",
                        gap: 1,
                        gridTemplateColumns: isOtherMalfSystem
                          ? {
                              xs: "1fr",
                              sm: "repeat(2, minmax(0, 1fr))",
                            }
                          : "1fr",
                      }}
                    >
                      <FilterDropdown
                        label={label}
                        options={finalOptions}
                        selected={selectValue ? [selectValue] : []}
                        setSelected={(values) => {
                          const selected = values[0] || "";
                          setIsOtherMalfSystem(
                            selected === OTHER_MALF_SYSTEM,
                          );
                          if (selected === OTHER_MALF_SYSTEM) {
                            setCustomMalfSystem("");
                          }
                          handleChange(key, selected);
                        }}
                        isMultiple={false}
                        width="100%"
                        isReset={false}
                        disabled={!editable}
                      />
                      {isOtherMalfSystem && (
                        <FilterSearchBar
                          label={OTHER_MALF_SYSTEM_LABEL}
                          value={customMalfSystem}
                          setSearch={(value) => {
                            setCustomMalfSystem(value);
                            handleChange(key, OTHER_MALF_SYSTEM);
                          }}
                          width="100%"
                          isReset={false}
                          disabled={!editable}
                        />
                      )}
                    </Box>
                  ) : isDate ? (
                    <FilterDateTime
                      label={label}
                      value={value}
                      setDate={(d) => handleChange(key, d)}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                    />
                  ) : key === "issueDescription" ? (
                    <FilterSearchBar
                      label={label}
                      value={inputValue}
                      setSearch={(value) => {
                        handleChange(key, value);
                      }}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                      multiline
                    />
                  ) : isSelect ? (
                    <FilterDropdown
                      label={label}
                      options={finalOptions}
                      selected={selectValue ? [selectValue] : []}
                      setSelected={(values) => {
                        handleChange(key, values[0] || "");
                      }}
                      isMultiple={false}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                    />
                  ) : (
                    <FilterSearchBar
                      label={label}
                      value={inputValue}
                      setSearch={(value) => {
                        handleChange(key, value);
                      }}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", gap: 2, p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          {t("cancel")}
        </Button>
        <Button
          onClick={saveChanges}
          variant="contained"
          disabled={loading || !isFormDirty}
        >
          {t("save")}
        </Button>
      </DialogActions>
      <CustomAlert
        open={alertOpen}
        onClose={closeAlert}
        message={alertMessage}
        severity={alertSeverity}
      />
    </Dialog>
  );
};

export default IssueInformation;
