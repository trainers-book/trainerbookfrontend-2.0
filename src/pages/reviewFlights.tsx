import type React from "react";
import { useState } from "react";
import FlightData from "../types/tables/flight";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import NewFlightModel from "../components/Popup/NewFlight/newFlight";
import FilterFlights from "../components/filterTables/filterFlights";
import { Box } from "@mui/material";
import InfinateScrollFetch from "../components/table/infinateScrollTableFetch";

const ReviewFlights: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const filterData = (data: FlightData[]) => {
    return data.filter((dataSet) => {
      const getDate = (date: Date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      };

      return (
        (selectedPlatforms.length == 0 ||
          selectedPlatforms.includes(dataSet.platform)) &&
          (selectedDate == "" || getDate(dataSet.dateTime) == selectedDate)
      );
    });
  };

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
            setDate={setSelectedDate}
          />
        </Box>
        <NewFlightModel />
      </Box>
      <InfinateScrollFetch
        properties={Object.keys(new FlightData({})).filter(
          (property) => !property.includes("_") && property != "dateTime"
        )}
        sortFunction={(currentValue, nextValue) =>
          nextValue.dateTime.getTime() - currentValue.dateTime.getTime()
        }
        fetchCollection="PreservedFlights"
        color={false}
        objectFromFetch={objectFromFetch}
        filterData={filterData}
        searchQuery={searchQuery}
      />
    </PageWrapper>
  );
};

export default ReviewFlights;
