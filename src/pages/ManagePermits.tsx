import type React from "react";
import { useEffect, useMemo, useState } from "react";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import { Box } from "@mui/material";
import { usePlatforms } from "../context/platformsContext";
import NewPermitModel from "../components/Popup/newPermit/newPermit";
import InfinateScrollFetch from "../components/table/infinateScrollTableFetch";
import PermitData, { getPermitColor, PermitObjectFromFetch } from "../types/tables/permits";
import FilterPermits from "../components/filterTables/filterPermits";
import { PermitStatus } from "../types/statuses";

const ManagePermits: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<
      { minDate: Date; maxDate: Date } | undefined
    >(undefined);
  const { platforms } = usePlatforms();

  const getPlatformsAndFilters = () => {
    const filters: {
      status: (string | undefined)[];
      minDate?: Date;
      maxDate?: Date;
      search?: string
    } = {
      status:
        selectedStatuses.length == 0
          ? []
          : selectedStatuses.map((status) => {
            return Object.keys(PermitStatus).find(
              (key) => PermitStatus[key as keyof typeof PermitStatus] === status,
            );
          }),
    };

    if (selectedDate) {
      filters.minDate = selectedDate.minDate;
      filters.maxDate = selectedDate.maxDate;
    }

    if (searchQuery) {
      filters.search = searchQuery;
    }

    return {
      platforms: selectedPlatforms.length == 0 ? platforms : selectedPlatforms,
      filters: filters
    };
  };

  const memoTable = useMemo(() => {
    return (
      <InfinateScrollFetch
        properties={Object.keys(new PermitData({})).filter(
          (property) => !property.includes("_"),
        )}
        getRowKey={(row: PermitData) => `${row._id}`}
        sortFunction={(currentValue, nextValue) =>
          nextValue.dateTime.getTime() - currentValue.dateTime.getTime()
        }
        fetchCollection="Permissions"
        getRowClass={getPermitColor}
        color={true}
        objectFromFetch={PermitObjectFromFetch}
        platformsAndFilters={getPlatformsAndFilters()}
      />
    );
  }, [selectedPlatforms, selectedStatuses, selectedDate, searchQuery]);

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
          <FilterPermits
            selectedPlatform={selectedPlatforms}
            setSelectedPlatform={setSelectedPlatforms}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            search={searchQuery}
            setSearch={setSearchQuery}
            dateSelected={selectedDate}
            setDate={setSelectedDate}
          />
        </Box>
        <NewPermitModel />
      </Box>
      {memoTable}
    </PageWrapper>
  );
};

export default ManagePermits;
