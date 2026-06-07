import {
  AlertColor,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { HttpStatusCode } from "axios";
import { useBackend } from "../../../context/backendContext";
import { usePlatforms } from "../../../context/platformsContext";
import { PermitStatus } from "../../../types/statuses";
import PermitData, {
  PermitObjectFromFetch,
} from "../../../types/tables/permits";
import CustomAlert from "../../Dynamics/CustomAlert";
import FilterDateTime from "../../Dynamics/filterDateTime";
import FilterDropdown from "../../Dynamics/filterDropdown";
import FilterSearchBar from "../../Dynamics/filterSearchBar";

interface PermitInformationProps {
  isOpen: boolean;
  selectedRow: PermitData;
  onClose: () => void;
  onSave?: (updatedRow: PermitData) => void;
}

const DATE_FIELDS = new Set(["dateTime", "expiredDate", "closeDate"]);

const PermitInformation: React.FC<PermitInformationProps> = ({
  isOpen,
  selectedRow,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const { connection } = useBackend();
  const { platforms } = usePlatforms();
  const [formValues, setFormValues] = useState<any>(selectedRow);
  const [initialValues, setInitialValues] = useState<any>(selectedRow);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [openerOptions, setOpenerOptions] = useState<string[]>([]);

  useEffect(() => {
    loadRawPermit();
  }, [selectedRow]);

  useEffect(() => {
    loadOpenerOptions();
  }, [formValues?.platform]);

  const mapRawToForm = (permit: any) => ({
    _id: permit._id,
    dateTime: new Date(permit.openingDate ?? permit.dateTime ?? new Date()),
    platform: permit.platform ?? "",
    permitName: permit.permissionName ?? permit.permitName ?? "",
    permitDescription:
      permit.permissionDescription ?? permit.permitDescription ?? "",
    openBy: permit.permissionOpener ?? permit.openBy ?? "",
    expiredDate: new Date(
      permit.expirationDate ?? permit.expiredDate ?? new Date(),
    ),
    closedBy: permit.closedBy ?? "",
    closeDate: permit.closeDate ? new Date(permit.closeDate) : new Date(),
    permitStatus:
      permit.status && permit.status in PermitStatus
        ? PermitStatus[permit.status as keyof typeof PermitStatus]
        : permit.status ?? permit.permitStatus ?? PermitStatus.Open,
  });

  const loadRawPermit = async () => {
    if (!selectedRow) {
      setFormValues(undefined);
      setInitialValues(undefined);
      return;
    }

    const response = await connection.getAllEntities("Permissions");
    if (response.status === HttpStatusCode.Ok && Array.isArray(response.data)) {
      const found = response.data.find(
        (permit: any) => String(permit._id) === String(selectedRow._id),
      );

      if (found) {
        const mapped = mapRawToForm(found);
        setFormValues(mapped);
        setInitialValues(mapped);
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

  const loadOpenerOptions = async () => {
    if (!formValues?.platform) {
      setOpenerOptions([]);
      return;
    }

    const roleResponses = await Promise.all([
      connection.getAllEntities("Instructor"),
      connection.getAllEntities("Pilot"),
      connection.getAllEntities("Technician"),
    ]);

    const options = roleResponses.flatMap((response) => {
      if (response.status !== HttpStatusCode.Ok || !Array.isArray(response.data)) {
        return [];
      }

      return response.data
        .filter((person: any) =>
          personBelongsToPlatform(person, formValues.platform),
        )
        .map((person: any) => person.name)
        .filter(Boolean);
    });

    setOpenerOptions(Array.from(new Set(options)));
  };

  const handleChange = (key: string, value: any) => {
    setFormValues((prev: any) => ({ ...prev, [key]: value }));
  };

  const areValuesEqual = (a: any, b: any) => {
    if (a === b) return true;
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
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

  const mapStatusToEnum = (value: any) => {
    if (!value) return "Open";
    return (
      Object.keys(PermitStatus).find(
        (key) => PermitStatus[key as keyof typeof PermitStatus] === value,
      ) ?? value
    );
  };

  const toTimestamp = (value: any) => {
    if (!value) return undefined;
    return value instanceof Date ? value.getTime() : new Date(value).getTime();
  };

  const saveChanges = async () => {
    if (!formValues) return;

    const bodyToSend = {
      _id: formValues._id,
      platform: formValues.platform,
      permissionName: formValues.permitName,
      permissionDescription: formValues.permitDescription,
      permissionOpener: formValues.openBy,
      openingDate: toTimestamp(formValues.dateTime),
      expirationDate: toTimestamp(formValues.expiredDate),
      closedBy: formValues.closedBy,
      closeDate: toTimestamp(formValues.closeDate),
      status: mapStatusToEnum(formValues.permitStatus),
    };

    setLoading(true);
    const update = await connection.updateEntity("Permissions", bodyToSend);

    if (update && update.status === HttpStatusCode.Ok) {
      const savedPermit = {
        ...(update.data ?? {}),
        ...bodyToSend,
      };
      const mapped = PermitObjectFromFetch(savedPermit);

      setFormValues(mapRawToForm(savedPermit));
      setInitialValues(mapRawToForm(savedPermit));
      onSave?.(mapped);
      setAlertSeverity("success");
      setAlertMessage(t("saveSuccessful"));
      setAlertOpen(true);
      setTimeout(() => {
        onClose();
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
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
            }}
          >
            {Object.keys(formValues).map((key) => {
              const value = formValues[key];
              const editable = key !== "_id";
              const label = key === "_id" ? t("permitNumber") : t(key);
              const fullWidth =
                key === "permitDescription" || key === "permitName";

              return (
                <Box
                  key={key}
                  sx={{ gridColumn: fullWidth ? "1 / -1" : undefined }}
                >
                  {key === "platform" ? (
                    <FilterDropdown
                      label={label}
                      options={platforms}
                      selected={value ? [String(value)] : []}
                      setSelected={(selected) =>
                        handleChange(key, selected[0] || "")
                      }
                      isMultiple={false}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                    />
                  ) : key === "openBy" || key === "closedBy" ? (
                    <FilterDropdown
                      label={label}
                      options={
                        value && !openerOptions.includes(String(value))
                          ? [String(value), ...openerOptions]
                          : openerOptions
                      }
                      selected={value ? [String(value)] : []}
                      setSelected={(selected) =>
                        handleChange(key, selected[0] || "")
                      }
                      isMultiple={false}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                    />
                  ) : key === "permitStatus" ? (
                    <FilterDropdown
                      label={label}
                      options={Object.values(PermitStatus)}
                      selected={value ? [String(value)] : []}
                      setSelected={(selected) =>
                        handleChange(key, selected[0] || "")
                      }
                      isMultiple={false}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                    />
                  ) : DATE_FIELDS.has(key) ? (
                    <FilterDateTime
                      label={label}
                      value={value}
                      setDate={(date) => handleChange(key, date)}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                    />
                  ) : (
                    <FilterSearchBar
                      label={label}
                      value={value === undefined || value === null ? "" : String(value)}
                      setSearch={(newValue) => handleChange(key, newValue)}
                      width="100%"
                      isReset={false}
                      disabled={!editable}
                      multiline={key === "permitDescription"}
                    />
                  )}
                </Box>
              );
            })}
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

export default PermitInformation;
