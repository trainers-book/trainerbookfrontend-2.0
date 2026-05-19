import FilterSearchBar from "../Dynamics/filterSearchBar";
import "../../i18n";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { PlatformData } from "../../types/tables/manageTypes";

interface EditPlatformProps {
  platformData: PlatformData;
  objectCallback: (data: PlatformData) => void;
}

const EditPlatform: React.FC<EditPlatformProps> = ({ platformData, objectCallback }) => {
  const { t } = useTranslation();
  const [id, setId] = useState<string>("" + platformData._id);
  const [name, setName] = useState<string>(platformData.name);

const handleNameChange = (newName: string) => {
    setName(newName); 
    objectCallback(new PlatformData(newName, Number(id)));
  };

  return (
    <Box sx={{ mr: 1, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <FilterSearchBar
          label={t("platformId")}
          value={id}
          setSearch={setId}
          isReset={false}
          width="9rem"
          disabled
        />
        <FilterSearchBar
          label={t("platformName")}
          value={name}
          setSearch={handleNameChange}
          isReset={false}
          width="9rem"
        />
      </Box>
    </Box>
  );
};

export default EditPlatform;
