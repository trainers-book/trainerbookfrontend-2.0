import "../../i18n";

import NewEntity from "./newEntityForm";
import { PlatformData } from "../../types/tables/manageTypes";

interface NewPlatformProps {
  callback: (user: PlatformData) => void;
}

const NewPlatform: React.FC<NewPlatformProps> = ({  }) => {
  return (
    <NewEntity
      textInputs={[]}
      dropdownInputs={[]}
      callback={() => {
        // callback(new PlatformData());
        alert("orian's popup. permission just for the team");
      }}
    />
  );
};

export default NewPlatform;
