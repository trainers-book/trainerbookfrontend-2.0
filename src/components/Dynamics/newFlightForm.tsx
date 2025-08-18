import "../../i18n";
import { useTranslation } from "react-i18next";

import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import NewEntity from "./newEntityForm";
import { FlightData } from "../../types/tables/manageTypes";
import { usePlatforms } from "../../context/platformsContext";

interface NewFlightProps {
  callback: (user: FlightData) => void;
}

const NewFlight: React.FC<NewFlightProps> = ({ callback }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState<string>("");
  const { platforms } = usePlatforms();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  return (
    <NewEntity
      textInputs={[
        { label: t("flightName"), setter: setName },
      ]}
      dropdownInputs={[
        {
          label: t("platform"),
          options: platforms,
          selected: selectedPlatforms,
          setter: setSelectedPlatforms,
          multiple: false
        },
      ]}
      callback={() => {
        callback(new FlightData(new Date(), name, selectedPlatforms[0]));
      }}
    />
  );
};

export default NewFlight;
