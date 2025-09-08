import "../../i18n";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import NewEntity from "./newEntityForm";
import { usePlatforms } from "../../context/platformsContext";

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
        callback({
          firstName: name,
          lastName: lastName,
          displayName: name + " " + lastName,
          platform: selectedPlatforms,
          idNumber: idNumber,
        });
      }}
    />
  );
};

export default NewUser;
