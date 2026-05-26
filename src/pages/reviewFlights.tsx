import type React from "react";
import { useEffect, useMemo, useState } from "react";
import FlightData, { flightObjectFromFetch } from "../types/tables/flight";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import NewFlightModel from "../components/Popup/NewFlight/newFlight";
import FilterFlights from "../components/filterTables/filterFlights";
import { Box } from "@mui/material";
import { useLocalStorage } from "../context/localStorageContext";
import InfinateScrollFetch from "../components/table/infinateScrollTableFetch";
import { usePlatforms } from "../context/platformsContext";
import FlightInformation from "../components/Popup/information/flightInformation";
import { useBackend } from "../context/backendContext";
import { HttpStatusCode } from "axios";
import IssueData, { IssueObjectFromFetch } from "../types/tables/issues";

const ReviewFlights: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<{
    minDate?: number;
    maxDate?: number;
  }>({});
  const [filterChange, setFilterChange] = useState<boolean>(true);
  const [selectedFlightPopup, setSelectedFlightPopup] = useState<
    FlightData | undefined
  >();
  const [selectedFlightMalfs, setSelectedFlightMalfs] = useState<IssueData[]>(
    [],
  );
  const { platforms } = usePlatforms();
  const { connection } = useBackend();
  const [fields, setFields] = useState<string[]>([]);
  const [preservedFlights, setPreservedFlights] = useState<any[]>([]);
  const { ls } = useLocalStorage();

  useEffect(() => {
    setFilterChange(!filterChange);
  }, [selectedPlatforms, selectedDate]);

  useEffect(() => {
    if (!selectedFlightPopup) {
      setSelectedFlightMalfs([]);
    }
  }, [selectedFlightPopup]);

  const fetchIssuesForFlight = async (flight: FlightData) => {
  if (!flight) return;

  const response = await connection.getObjectsFilter(
    "FlightFailure",
    0,
    [flight.platform],
    {
      flightName: flight.flightName,
    }
  );

  if (response.status === HttpStatusCode.Ok) {
    setSelectedFlightMalfs(
      (response.data ?? [])
        .map((issue: any) => IssueObjectFromFetch(issue))
        .filter((issue: IssueData) => issue.flightName === flight.flightName)
    );
  }
};

  const getPlatformsAndFilters = () => {
    const filters: { minDate?: number; maxDate?: number } = {};

    if (selectedDate) {
      filters.minDate = selectedDate.minDate;
      filters.maxDate = selectedDate.maxDate;
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
          (property) => !property.includes("_") && property != "dateTime",
        )}
        getRowKey={(row: FlightData) => `${row.flightNumber}`}
        sortFunction={(currentValue, nextValue) =>
          nextValue.dateTime.getTime() - currentValue.dateTime.getTime()
        }
        fetchCollection="PreservedFlights"
        objectFromFetch={flightObjectFromFetch}
        platformsAndFilters={getPlatformsAndFilters()}
        clickable={(row: FlightData) => {
          fetchIssuesForFlight(row);
          setSelectedFlightPopup(row);
        }}
      />
    );
  }, [selectedPlatforms]);

  useEffect(() => {
    getTableFields();
  }, [selectedPlatforms]);

  useEffect(() => {
    getPreservedFlights();
  }, [fields]);

  const getPreservedFlights = async () => {
    const data = await connection.getAllPreservedFlights();

    setPreservedFlights(
      data.map((field: any) => ({
        ...field,
        instructor: field.instructor?.[0]?.name || field.instructor?.name || "",
        technician: field.technician?.[0]?.name || field.technician?.name || "",
        observer: field.observer?.[0]?.name || field.observer?.name || "",
        pilot: field.pilot?.[0]?.name || field.pilot?.name || "",
        navigator: field.navigator?.[0]?.name || field.navigator?.name || "",
        inspector: field.inspector?.[0]?.name || field.inspector?.name || "",
      })),
    );
  };

  const getTableFields = async () => {
    const data = await connection.getFlightTableFields();
    const platforms =
      selectedPlatforms.length > 0
        ? selectedPlatforms
        : (ls.getPlatforms()?.split(",") ?? []);

    setFields(
      data["fields"]
        .filter((field: any) =>
          field.showFor.some((platform: any) =>
            platforms.includes(t(platform)),
          ),
        )
        .map((field: any) => field.display),
    );
  };

  useEffect(() => {
    setFilterChange(!filterChange);
  }, [selectedPlatforms, selectedDate]);

  const objectFromFetch = (flight: any) => {
    return new FlightData({
      ...flight,
      dateTime: new Date(flight.dateTime),
      flightNumber: flight._id,
      instructorName: flight.instructor?.name,
      observer: flight.observer?.name,
      _130: flight["130"],
      _131: flight["131"],
      _132: flight["132"],
      _133: flight["133"],
      _140: flight["140"],
      _141: flight["141"],
      _142: flight["142"],
      _143: flight["143"],
    });
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
            setSelectedPlatform={setSelectedPlatforms}
            search={searchQuery}
            setSearch={setSearchQuery}
            dateSelected={selectedDate}
            setDate={(value) => {
              if (value === undefined) {
                setSelectedDate({});
              } else {
                setSelectedDate({
                  minDate: value.minDate?.getTime(),
                  maxDate: value.maxDate?.getTime(),
                });
              }
            }}
          />
        </Box>
        <NewFlightModel />
      </Box>
      {memoTable}
      {selectedFlightPopup && (
        <FlightInformation
          selectedRow={selectedFlightPopup}
          handleClose={() => setSelectedFlightPopup(undefined)}
          flightMalfunctions={selectedFlightMalfs}
        />
      )}
    </PageWrapper>
  );
};

export default ReviewFlights;
