import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import GenericTable from "../components/table/table";
import FilterFlights from "../components/filterTables/filterFlights";
import { Box } from "@mui/material";
import { useBackend } from "../context/backendContext";
import { usePlatforms } from "../context/platformsContext";
import NewPermitModel from "../components/Popup/newPermit/newPermit";

const ManagePermits: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const { connection } = useBackend();
  const [fields, setFields] = useState<string[]>([]);
  const [permits, setPermits] = useState<any[]>([]);
  const { platforms } = usePlatforms();

  useEffect(() => {
    getTableFields();
  }, [selectedPlatforms]);

  useEffect(() => {
    getPermits();
  }, [fields]);

  const getPermits = async () => {
    const data = await connection.getAllPermissions();

    setPermits(data.filter((field: any) => platforms.includes(field.platform)));
  };

  const getTableFields = async () => {
    const data = await connection.getPermissionsTableFields();

    setFields(data["fields"].map((field: any) => field.display));
  };

  const changePlatform = (selected: string[]) => {
    setSelectedPlatforms(selected);
  };

  const changeSearch = (search: string) => {
    setSearchQuery(search);
  };

  const changedate = (selected: string) => {
    setSelectedDate(selected);
  };

  return (
    <PageWrapper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            mb: 1,
          }}
        >
          <FilterFlights
            selectedPlatform={selectedPlatforms}
            setSelectedPlatform={changePlatform}
            search={searchQuery}
            setSearch={changeSearch}
            dateSelected={selectedDate}
            setDate={changedate}
          />
        </Box>
        <NewPermitModel />
      </Box>
      <GenericTable
        properties={fields.map((field: any) => t(field, { lng: "heEn" }))}
        data={
          selectedPlatforms.length > 0
            ? permits.filter((field: any) =>
                selectedPlatforms.includes(field.platform)
              )
            : permits
        }
      ></GenericTable>
    </PageWrapper>
  );
};

export default ManagePermits;
