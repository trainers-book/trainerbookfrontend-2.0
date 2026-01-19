import "../../i18n";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import NewEntity from "./newEntityForm";
import { FlightData } from "../../types/tables/manageTypes";
import { usePlatforms } from "../../context/platformsContext";
import { CollectionIds, useBackend } from "../../context/backendContext";
import { HttpStatusCode } from "axios";

interface NewFlightProps {
  callback: (user: FlightData) => void;
}

const NewFlight: React.FC<NewFlightProps> = ({ callback }) => {
  const { connection } = useBackend();
  const { t } = useTranslation();
  const [name, setName] = useState<string>("");
  const { platforms } = usePlatforms();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const getFlightId = async () => {
    const id = await connection.getNextId(
      CollectionIds.PRESERVED_FLIGHT_NAME_ID
    );
    if (id.status == HttpStatusCode.InternalServerError) {
      return -1;
    } else {
      return id.data[0].sequenceValue;
    }
  };

  const createFlight = async () => {
    const id = await getFlightId();

    if (id == -1) {
      return;
    } else {
      callback(new FlightData(new Date(), name, selectedPlatforms[0], id));
    }
  };

  return (
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
      callback={() => {
        if (name.replace(/\s/g, "") != "" && platforms.length != 0) {
          createFlight();
        }
      }}
    />
  );
};

export default NewFlight;
