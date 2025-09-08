import FilterSearchBar from "../Dynamics/filterSearchBar";
import "../../i18n";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { platformData } from "../../types/tables/manageTypes";

interface EditPlatformProps {
    platformData: platformData;
}

const EditPlatform: React.FC<EditPlatformProps> = ({ platformData }) => {
  const { t } = useTranslation();
  const [id, setId] = useState<string>("" + platformData.id);
  const [name, setName] = useState<string>(platformData.name);  

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
          />
        <FilterSearchBar
          label={t("platformName")}
          value={name}
          setSearch={setName}
          isReset={false}
          width="9rem"
        />
      </Box>
    </Box>
  );
};

export default EditPlatform;
