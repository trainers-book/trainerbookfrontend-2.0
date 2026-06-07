import "../../i18n";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import NewEntity from "./newEntityForm";
import { PreservedFlightNameData } from "../../types/tables/manageTypes";
import { usePlatforms } from "../../context/platformsContext";
import {
  API_Pathes,
  CollectionIds,
  useBackend,
} from "../../context/backendContext";
import { HttpStatusCode } from "axios";
import CustomAlert from "../Dynamics/CustomAlert";
import { AlertColor } from "@mui/material";

interface NewFlightProps {
  callback: (user: PreservedFlightNameData) => void;
}

const NewFlight: React.FC<NewFlightProps> = ({ callback }) => {
  const { connection } = useBackend();
  const { t } = useTranslation();
  const [name, setName] = useState<string>("");
  const { platforms } = usePlatforms();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("warning");

  useEffect(() => {
    if (platforms.length === 1 && selectedPlatforms.length === 0) {
      setSelectedPlatforms([platforms[0]]);
    }
  }, [platforms, selectedPlatforms]);

  const getFlightId = async () => {
    const parseFlightId = (value: unknown) => {
      const direct = Number(value);
      if (!Number.isNaN(direct)) {
        return direct;
      }

      try {
        const parsed = JSON.parse(String(value));
        const parsedNumber = Number(parsed);
        return Number.isNaN(parsedNumber) ? 0 : parsedNumber;
      } catch {
        return 0;
      }
    };

    const existingFlights = await connection.getAllEntities(
      API_Pathes.PRESERVED_FLIGHT_NAME,
    );
    let nextExistingId = 1;

    if (
      existingFlights.status == HttpStatusCode.Ok &&
      Array.isArray(existingFlights.data)
    ) {
      nextExistingId =
        Math.max(
          0,
          ...existingFlights.data.map((flight: any) =>
            parseFlightId(flight._id),
          ),
        ) + 1;
    }

    const id = await connection.getNextId(
      CollectionIds.PRESERVED_FLIGHT_NAME_ID
    );

    if (id.status == HttpStatusCode.Ok) {
      const nextId = Number(id.data?.[0]?.sequenceValue);
      if (!Number.isNaN(nextId)) {
        return Math.max(nextId, nextExistingId);
      }
    }

    return nextExistingId;
  };

  const flightExistsForPlatform = async (flightName: string, platform: string) => {
    const existingFlights = await connection.getAllEntities(
      API_Pathes.PRESERVED_FLIGHT_NAME,
    );

    if (
      existingFlights.status != HttpStatusCode.Ok ||
      !Array.isArray(existingFlights.data)
    ) {
      return false;
    }

    const normalize = (value: unknown) => String(value ?? "").trim();
    return existingFlights.data.some(
      (flight: any) =>
        normalize(flight.flightName ?? flight.name) === flightName &&
        normalize(flight.platform) === platform,
    );
  };

  const createFlight = async (flightName: string, platform: string) => {
    const isDuplicate = await flightExistsForPlatform(flightName, platform);
    if (isDuplicate) {
      setAlertSeverity("error");
      setAlertMessage(t("flightAlreadyExists"));
      setAlertOpen(true);
      return false;
    }

    const id = await getFlightId();

    if (id == -1) {
      return false;
    }
    
    callback(new PreservedFlightNameData(new Date(), flightName, platform, id));
    return true;
  };

  return (
    <>
      <NewEntity
        textInputs={[{ label: t("flightName"), setter: setName }]}
        dropdownInputs={[
          {
            label: t("platform"),
            options: platforms,
            selected: selectedPlatforms,
            setter: setSelectedPlatforms,
            multiple: false,
          },
        ]}
        callback={async () => {
          const flightName = name.trim();
          const platform = selectedPlatforms[0];

          if (flightName !== "" && platform === undefined) {
            setAlertSeverity("warning");
            setAlertMessage(t("choosePlatform"));
            setAlertOpen(true);
            return false;
          }

          if (flightName != "" && platform != undefined) {
            return createFlight(flightName, platform);
          }
        }}
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

export default NewFlight;
