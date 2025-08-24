import "../../i18n";

import NewEntity from "./newEntityForm";
import { platformData } from "../../types/tables/manageTypes";

interface NewPlatformProps {
  callback: (user: platformData) => void;
}

const NewPlatform: React.FC<NewPlatformProps> = ({ callback }) => {

  return (
    <NewEntity
      textInputs={[]}
      dropdownInputs={[]}
      callback={() => {
        // callback(new platformData());
        alert("orian's popup. permission just for the team");
      }}
    />
  );
};

export default NewPlatform;
