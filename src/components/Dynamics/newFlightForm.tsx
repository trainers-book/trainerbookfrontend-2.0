import "../../i18n";
import { useTranslation } from "react-i18next";

import { useState } from "react";
import NewEntity from "./newEntityForm";
import { PreservedFlightNameData } from "../../types/tables/manageTypes";
import { usePlatforms } from "../../context/platformsContext";

interface NewFlightProps {
  callback: (user: PreservedFlightNameData) => void;
}

const NewFlight: React.FC<NewFlightProps> = ({ callback }) => {
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
        callback(new PreservedFlightNameData(new Date(), name, selectedPlatforms[0]));
      }}
    />
  );
};

export default NewFlight;
