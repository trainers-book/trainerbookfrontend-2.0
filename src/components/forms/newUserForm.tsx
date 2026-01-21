import "../../i18n";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import NewEntity from "./newEntityForm";
import { usePlatforms } from "../../context/platformsContext";
import { UsersData } from "../../types/tables/manageTypes";

interface NewUserProps {
  callback: (user: any) => void;
}

const NewUser: React.FC<NewUserProps> = ({ callback }) => {
  const { t } = useTranslation();
  const { platforms } = usePlatforms();
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [idNumber, setIdNumber] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  return (
    <NewEntity
      textInputs={[
        { label: t("firstName"), setter: setName },
        { label: t("lastName"), setter: setLastName },
        { label: t("idNumber"), setter: setIdNumber },
      ]}
      dropdownInputs={[
        {
          label: t("platforms"),
          options: platforms,
          selected: selectedPlatforms,
          setter: setSelectedPlatforms,
          multiple: true,
        },
      ]}
      callback={() => {
        if (
          name.replace(/\s/g, "") != "" &&
          lastName.replace(/\s/g, "") != "" &&
          idNumber.replace(/\s/g, "") != "" &&
          selectedPlatforms.length != 0
        )
          callback(new UsersData(idNumber, name, lastName, selectedPlatforms));
      }}
    />
  );
};

export default NewUser;
