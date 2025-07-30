import "../../i18n";
import { useTranslation } from "react-i18next";

import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import NewEntity from "./newEntityForm";
import UsersData from "../../types/tables/users";
import { platformTypes } from "../../types/platformTypes";

interface NewUserProps {
  callback: (user: UsersData) => void;
}

const NewUser: React.FC<NewUserProps> = ({ callback }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [personalNumber, setPersonalNumber] = useState<string>("");
  const [platforms, setPlatforms] = useState<string[]>([]);

  return (
    <NewEntity
      textInputs={[
        { label: t("firstName"), setter: setName },
        { label: t("lastName"), setter: setLastName },
        { label: t("personalNumber"), setter: setPersonalNumber },
      ]}
      dropdownInputs={[
        {
          label: t("platforms"),
          options: platformTypes,
          selected: platforms,
          setter: setPlatforms,
        },
      ]}
      callback={() => {
        callback(new UsersData(name, lastName, personalNumber, platforms));
      }}
    />
  );
};

export default NewUser;
