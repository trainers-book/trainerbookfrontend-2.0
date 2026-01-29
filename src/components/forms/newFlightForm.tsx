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
    const flightName = name;
    const platform = selectedPlatforms[0];
    const id = await getFlightId();

    if (id == -1) {
      return;
    }
    
    callback(new FlightData(new Date(), flightName, platform, id));
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
        if (name.replace(/\s/g, "") != "" && selectedPlatforms.length != 0) {
          createFlight();
        }
      }}
    />
  );
};

export default NewFlight;
