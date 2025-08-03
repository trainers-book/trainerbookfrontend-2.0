import "../../i18n";
import { useTranslation } from "react-i18next";

import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import NewEntity from "./newEntityForm";
import { FlightData, UsersData } from "../../types/tables/manageTypes";
import { platformTypes } from "../../types/platformTypes";

interface NewFlightProps {
  callback: (user: FlightData) => void;
}

const NewFlight: React.FC<NewFlightProps> = ({ callback }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState<string>("");
  const [platforms, setPlatforms] = useState<string[]>([]);

  return (
    <NewEntity
      textInputs={[
        { label: t("flightName"), setter: setName },
      ]}
      dropdownInputs={[
        {
          label: t("platform"),
          options: platformTypes,
          selected: platforms,
          setter: setPlatforms,
          multiple: false
        },
      ]}
      callback={() => {
        callback(new FlightData(name, platforms[0]));
      }}
    />
  );
};

export default NewFlight;
