import type React from "react";
import { useEffect, useMemo, useState } from "react";
import FlightData, { flightObjectFromFetch } from "../types/tables/flight";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import NewFlightModel from "../components/Popup/NewFlight/newFlight";
import FilterFlights from "../components/filterTables/filterFlights";
import { Box, Button } from "@mui/material";
import InfinateScrollFetch from "../components/table/infinateScrollTableFetch";
import { usePlatforms } from "../context/platformsContext";
import FlightInformation from "../components/Popup/information/flightInformation";
import { useBackend } from "../context/backendContext";
import { HttpStatusCode } from "axios";
import IssueData, { IssueObjectFromFetch } from "../types/tables/issues";
import { useTranslation } from "react-i18next";

const ReviewFlights: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<
      { minDate: Date; maxDate: Date } | undefined
    >(undefined);
  const [filterChange, setFilterChange] = useState<boolean>(true);
  const [selectedFlightPopup, setSelectedFlightPopup] = useState<
    FlightData | undefined
  >();
  const [updatedFlight, setUpdatedFlight] = useState<FlightData | undefined>();
  const [selectedFlightMalfs, setSelectedFlightMalfs] = useState<IssueData[]>(
    []
  );
  const { platforms } = usePlatforms();
  const { connection } = useBackend();
  const [isNewFlightOpen, setIsNewFlightOpen] = useState(false);
  const [externalUpdate, setExternalUpdate] = useState<FlightData>();
  const { t } = useTranslation();

  useEffect(() => {
    setFilterChange(!filterChange);
  }, [selectedPlatforms, selectedDate, searchQuery]);

  const getMalfsForFlight = async () => {
    if (!selectedFlightPopup) {
      return;
    }

    const response = await connection.getFlightMalfs(
      selectedFlightPopup!.platform,
      selectedFlightPopup!._malfNumbers
    );

    if (response.status == HttpStatusCode.Ok) {
      setSelectedFlightMalfs(
        response.data.map((malf: any) => IssueObjectFromFetch(malf))
      );
    }
  };

  useEffect(() => {
    getMalfsForFlight();
  }, [selectedFlightPopup]);

  const getPlatformsAndFilters = () => {
    const filters: { minDate?: Date; maxDate?: Date ;search?: string} = {};

    if (selectedDate) {
      filters.minDate = selectedDate.minDate;
      filters.maxDate = selectedDate.maxDate;
    }

    if (searchQuery) {
      filters.search = searchQuery;
    }
    
    return {
      platforms: selectedPlatforms.length == 0 ? platforms : selectedPlatforms,
      filters: filters,
    };
  };

  const memoTable = useMemo(() => {
    return (
      <InfinateScrollFetch
        properties={Object.keys(new FlightData({})).filter(
          (property) => !property.includes("_") && property != "dateTime"
        )}
        getRowKey={(row: FlightData) => `${row.flightNumber}`}
        sortFunction={(currentValue, nextValue) =>
          nextValue.dateTime.getTime() - currentValue.dateTime.getTime()
        }
        fetchCollection="PreservedFlights"
        objectFromFetch={flightObjectFromFetch}
        platformsAndFilters={getPlatformsAndFilters()}
        externalUpdate={updatedFlight}
        clickable={(row: FlightData) => {
          setSelectedFlightPopup(row);
        }}
      />
    );
  }, [selectedPlatforms, selectedDate, updatedFlight, searchQuery]);


  useEffect(() => {
    setFilterChange(!filterChange);
  }, [selectedPlatforms, selectedDate]);

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
            setSelectedPlatform={setSelectedPlatforms}
            search={searchQuery}
            setSearch={setSearchQuery}
            dateSelected={selectedDate}
            setDate={setSelectedDate}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsNewFlightOpen(true)}
          sx={{ background: "rgb(114, 156, 240)", ml: 2, mb: 1 }}
        >
          {t("newFlight")}
        </Button>
        <NewFlightModel
          open={isNewFlightOpen}
          onClose={() => setIsNewFlightOpen(closed)}
          onSave={(flight) => setExternalUpdate(flightObjectFromFetch(flight))}
        />
      </Box>
      {memoTable}
      {selectedFlightPopup && (
        <FlightInformation
          selectedRow={selectedFlightPopup}
          handleClose={() => setSelectedFlightPopup(undefined)}
          flightMalfunctions={selectedFlightMalfs}
          onSave={(flight) => {
            setSelectedFlightPopup(flight);
            setUpdatedFlight(flight);
          }}
        />
      )}
    </PageWrapper>
  );
};

export default ReviewFlights;
