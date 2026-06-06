import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  AlertColor,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { HttpStatusCode } from "axios";
import InfinateScrollData from "../../table/infinateScrollTableData";
import IssueData, { getIssueColor } from "../../../types/tables/issues";
import FlightData from "../../../types/tables/flight";
import { API_Pathes, useBackend } from "../../../context/backendContext";
import FilterDateTime from "../../Dynamics/filterDateTime";
import FilterDropdown from "../../Dynamics/filterDropdown";
import FilterSearchBar from "../../Dynamics/filterSearchBar";
import CustomAlert from "../../Dynamics/CustomAlert";

interface FlightInformationProps {
  selectedRow: any;
  handleClose: () => void;
  flightMalfunctions: IssueData[];
  onSave?: (updatedRow: FlightData) => void;
}

const EXCLUDE_FIELDS = new Set([
  "date",
  "startTime",
]);

const FlightInformation: React.FC<FlightInformationProps> = ({
  selectedRow,
  handleClose,
  flightMalfunctions,
  onSave,
}) => {
  const { t } = useTranslation();
  const { connection } = useBackend();
  const [formValues, setFormValues] = useState<any>(selectedRow);
  const [initialValues, setInitialValues] = useState<any>(selectedRow);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [flightNameOptions, setFlightNameOptions] = useState<string[]>([]);
  const [instructorOptions, setInstructorOptions] = useState<string[]>([]);
  const [pilotOptions, setPilotOptions] = useState<string[]>([]);
  const [fieldOptions, setFieldOptions] = useState<Record<string, string[]>>(
    {},
  );

  useEffect(() => {
    loadRawFlight();
  }, [selectedRow]);

  useEffect(() => {
    loadFlightNameOptions();
    loadRoleOptions();
    loadDynamicFieldOptions();
  }, [formValues?.platform]);

  const loadRawFlight = async () => {
    if (!selectedRow) {
      setFormValues(undefined);
      setInitialValues(undefined);
      return;
    }

    const preservedFlights = await connection.getAllEntities(
      API_Pathes.PRESERVED_FLIGHTS,
    );

    if (
      preservedFlights.status === HttpStatusCode.Ok &&
      Array.isArray(preservedFlights.data)
    ) {
      const rawFlight = preservedFlights.data.find(
        (flight: any) =>
          String(flight._id) === String(selectedRow.flightNumber) ||
          String(flight._id) === String(selectedRow._id),
      );

      if (rawFlight) {
        setFormValues({ ...rawFlight });
        setInitialValues({ ...rawFlight });
        return;
      }
    }

    setFormValues(selectedRow);
    setInitialValues(selectedRow);
  };

  const personBelongsToPlatform = (person: any, platform: string) => {
    const personPlatforms = person.platform ?? person.platforms ?? [];

    return Array.isArray(personPlatforms)
      ? personPlatforms.includes(platform)
      : String(personPlatforms).includes(platform);
  };

  const loadFlightNameOptions = async () => {
    if (!formValues?.platform) {
      setFlightNameOptions([]);
      return;
    }

    const response = await connection.getAllEntities(
      API_Pathes.PRESERVED_FLIGHT_NAME,
    );

    if (response.status !== HttpStatusCode.Ok || !Array.isArray(response.data)) {
      setFlightNameOptions([]);
      return;
    }

    const translatedPlatform = t(formValues.platform, { lng: "heEn" });
    setFlightNameOptions(
      response.data
        .filter(
          (flight: any) =>
            flight.platform === formValues.platform ||
            flight.platform === translatedPlatform,
        )
        .map((flight: any) => flight.name || flight.flightName)
        .filter(Boolean),
    );
  };

  const loadRoleOptions = async () => {
    if (!formValues?.platform) {
      setInstructorOptions([]);
      setPilotOptions([]);
      return;
    }

    const [instructors, pilots] = await Promise.all([
      connection.getAllEntities(API_Pathes.INSTRUCTOR),
      connection.getAllEntities(API_Pathes.PILOT),
    ]);

    if (instructors.status === HttpStatusCode.Ok && Array.isArray(instructors.data)) {
      setInstructorOptions(
        instructors.data
          .filter((person: any) =>
            personBelongsToPlatform(person, formValues.platform),
          )
          .map((person: any) => person.name)
          .filter(Boolean),
      );
    } else {
      setInstructorOptions([]);
    }

    if (pilots.status === HttpStatusCode.Ok && Array.isArray(pilots.data)) {
      setPilotOptions(
        pilots.data
          .filter((person: any) =>
            personBelongsToPlatform(person, formValues.platform),
          )
          .map((person: any) => person.name)
          .filter(Boolean),
      );
    } else {
      setPilotOptions([]);
    }
  };

  const getFieldKeys = (field: any) => {
    return Array.from(
      new Set(
        [
          field.key,
          field.fieldName,
          field.field,
          field.value,
          field.displayName,
          field.display,
          field.name,
        ].filter(Boolean),
      ),
    ).map(String);
  };

  const normalizeOptions = (options: any) => {
    if (!Array.isArray(options)) return [];

    return options
      .map((option: any) => {
        if (option && typeof option === "object") {
          return option.name ?? option.value ?? Object.values(option)[0];
        }
        return option;
      })
      .filter(Boolean)
      .map(String);
  };

  const getVariables = async (field: any) => {
    if (field.fieldOptions) {
      return normalizeOptions(field.fieldOptions);
    }

    if (!field.name) {
      return [];
    }

    const fieldVariables = await connection.getAllEntities(field.name);
    if (fieldVariables.status !== HttpStatusCode.Ok) {
      return [];
    }

    if (field.name === "MPD" && fieldVariables.data?.data) {
      return normalizeOptions(fieldVariables.data.data);
    }

    return normalizeOptions(fieldVariables.data);
  };

  const loadDynamicFieldOptions = async () => {
    if (!formValues?.platform) {
      setFieldOptions({});
      return;
    }

    const response = await connection.getAllEntities(API_Pathes.NEW_FLIGHT_FIELDS);
    if (response.status !== HttpStatusCode.Ok || !Array.isArray(response.data)) {
      setFieldOptions({});
      return;
    }

    const translatedPlatform = t(formValues.platform, { lng: "heEn" });
    const fieldsForPlatform = response.data.filter((field: any) => {
      if (!Array.isArray(field.showFor)) return true;
      return (
        field.showFor.includes(formValues.platform) ||
        field.showFor.includes(translatedPlatform)
      );
    });

    const optionsByField: Record<string, string[]> = {};

    await Promise.all(
      fieldsForPlatform.map(async (field: any) => {
        const options = await getVariables(field);
        if (options.length > 0) {
          getFieldKeys(field).forEach((fieldKey) => {
            optionsByField[fieldKey] = options;
          });
        }
      }),
    );

    setFieldOptions(optionsByField);
  };

  const handleChange = (key: string, value: any) => {
    setFormValues((prev: any) => ({ ...prev, [key]: value }));
  };

  const normalizeSeconds = (value: any) => {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string") {
      if (value.includes(":")) {
        const [hours = "0", minutes = "0", seconds = "0"] = value.split(":");
        return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
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

  const getDisplayValue = (value: any) => {
    if (value === undefined || value === null) return "";
    if (typeof value === "object") {
      return value.name ?? value.value ?? "";
    }
    return String(value);
  };

  const normalizeSaveValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.map((item) => normalizeSaveValue(item));
    }
    if (value && typeof value === "object" && !(value instanceof Date)) {
      return value.name ?? value.value ?? value;
    }
    return value;
  };

  const normalizeFlightForSave = (flight: any) => {
    const normalized = Object.fromEntries(
      Object.entries(flight).map(([key, value]) => [
        key,
        normalizeSaveValue(value),
      ]),
    );

    if (normalized.instructorName && !normalized.instructor) {
      normalized.instructor = normalized.instructorName;
    }
    if (normalized.instructor && !normalized.instructorName) {
      normalized.instructorName = normalizeSaveValue(normalized.instructor);
    }

    return normalized;
  };

  const getDropdownOptions = (key: string, displayValue: string) => {
    const translatedKey = t(key);
    const englishKey = t(key, { lng: "heEn" });
    const options =
      key === "flightName"
        ? flightNameOptions
        : key === "instructorName"
        ? instructorOptions
        : key === "pilot"
          ? pilotOptions
          : fieldOptions[key] ??
            fieldOptions[translatedKey] ??
            fieldOptions[englishKey];

    if (!options) return undefined;

    return displayValue && !options.includes(displayValue)
      ? [displayValue, ...options]
      : options;
  };

  const areValuesEqual = (a: any, b: any) => {
    if (a === b) return true;
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }
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

  const visibleKeys = formValues
    ? Object.keys(formValues).filter(
        (key) => !EXCLUDE_FIELDS.has(key) && !key.startsWith("_"),
      )
    : [];

  const saveChanges = async () => {
    if (!formValues) return;
    const nextDateTime =
      formValues.dateTime instanceof Date
        ? formValues.dateTime
        : new Date(formValues.dateTime);

    const bodyToSend = {
      ...normalizeFlightForSave(formValues),
      _id: formValues._id ?? formValues.flightNumber,
      dateTime: nextDateTime.getTime(),
      date: nextDateTime.toLocaleDateString("en-GB"),
      startTime: nextDateTime.toLocaleTimeString([], {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      flightTime: normalizeSeconds(formValues.flightTime),
    };

    delete bodyToSend._iafWeek;

    setLoading(true);
    const update = await connection.updateEntity(
      API_Pathes.PRESERVED_FLIGHTS,
      bodyToSend,
    );

    if (update && update.status === HttpStatusCode.Ok) {
      const savedFlight = {
        ...(update.data ?? {}),
        ...bodyToSend,
        _id: bodyToSend._id ?? update.data?._id,
      };
      const mapped = new FlightData({
        ...savedFlight,
        dateTime: new Date(savedFlight.dateTime),
        flightNumber: savedFlight._id,
        instructorName:
          savedFlight.instructorName ?? savedFlight.instructor?.name,
        observer: savedFlight._observer ?? savedFlight.observer?.name,
        malfNumbers: savedFlight._malfNumbers ?? savedFlight.malfNumbers,
        airCrew1: savedFlight._airCrew1 ?? savedFlight.airCrew1,
        airCrew2: savedFlight._airCrew2 ?? savedFlight.airCrew2,
        block: savedFlight._block ?? savedFlight.block,
        disruption: savedFlight._disruption ?? savedFlight.disruption,
        navigator: savedFlight._navigator ?? savedFlight.navigator,
        pilot: savedFlight._pilot ?? savedFlight.pilot,
        technician: savedFlight._technician ?? savedFlight.technician,
        timeOffFlight: savedFlight._timeOffFlight ?? savedFlight.timeOffFlight,
        configuration:
          savedFlight._configuration ?? savedFlight.configuration,
        inspectorInstructor:
          savedFlight._inspectorInstructor ??
          savedFlight.inspectorInstructor,
      });

      setFormValues(savedFlight);
      setInitialValues(savedFlight);
      onSave?.(mapped);
      setAlertSeverity("success");
      setAlertMessage(t("saveSuccessful"));
      setAlertOpen(true);
      setTimeout(() => {
        handleClose();
      }, 700);
    } else {
      setAlertSeverity("error");
      setAlertMessage(t("saveFailed"));
      setAlertOpen(true);
    }

    setLoading(false);
  };

  if (!formValues) {
    return null;
  }

  return (
    <>
      <Dialog
        open={true}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={flightMalfunctions.length != 0 ? "xl" : "md"}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              mt: 1,
            }}
          >
            {visibleKeys.map((key) => {
              const value = formValues[key];
              const displayValue = getDisplayValue(value);
              const editable = key !== "platform" && key !== "flightNumber";
              const label = t(key);
              const dropdownOptions = getDropdownOptions(key, displayValue);

              return (
                <Box
                  key={key}
                  sx={{
                    gridColumn: key === "flightTime" ? "1 / -1" : undefined,
                  }}
                >
                  {key === "dateTime" ? (
                    <FilterDateTime
                      label={label}
                      value={value}
                      setDate={(date) => handleChange(key, date)}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                    />
                  ) : dropdownOptions ? (
                    <FilterDropdown
                      label={label}
                      options={dropdownOptions}
                      selected={displayValue ? [displayValue] : []}
                      setSelected={(selected) =>
                        handleChange(key, selected[0] || "")
                      }
                      isMultiple={false}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                    />
                  ) : key === "flightTime" ? (
                    <Box>
                      <Typography sx={{ mb: 0.5 }}>{label}</Typography>
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
                              <Box
                                key={part}
                                sx={{
                                  display: "flex",
                                  gap: 0.75,
                                  alignItems: "center",
                                }}
                              >
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
                                    width: "4rem",
                                    "& .MuiInputBase-root": {
                                      borderRadius: 2,
                                    },
                                    "& .MuiInputBase-input": {
                                      padding: "6.5px",
                                      textAlign: "center",
                                    },
                                  }}
                                />
                              </Box>
                            );
                          },
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <FilterSearchBar
                      label={label}
                      value={
                        Array.isArray(value)
                          ? value.join(", ")
                          : displayValue
                      }
                      setSearch={(newValue) => handleChange(key, newValue)}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
          {flightMalfunctions.length != 0 && (
            <Box sx={{ mt: 5 }}>
              <InfinateScrollData
                properties={Object.keys(new IssueData({})).filter(
                  (property) =>
                    !property.includes("_") && property != "platform",
                )}
                data={flightMalfunctions}
                getRowKey={(row: IssueData) => `${row.issueNumber}`}
                noHeight={true}
                color={true}
                getRowClass={getIssueColor}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", gap: 2, p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
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
      </Dialog>
      <CustomAlert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
        severity={alertSeverity}
      />
    </>
  );
};

export default FlightInformation;
