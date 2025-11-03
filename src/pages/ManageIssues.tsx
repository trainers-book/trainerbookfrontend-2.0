import PageWrapper from "../components/pageWrapper/PageWrapper";
import "../types/tableTypes";
import IssueData from "../types/tables/issues";
import { Status } from "../types/statuses";
import { Box } from "@mui/material";
import type React from "react";
import { useState } from "react";
import FilterIssues from "../components/filterTables/filterIssues";
import NewMalfModel from "../components/Popup/newMalf/newMalf";
import InfinateScroll from "../components/table/infinateScrollTableFetch";

const ManageIssues: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const getRowClass = (row: IssueData) => {
    return Object.keys(Status)
    .filter((value) => Status[value as keyof typeof Status] === row.status)[0]
    .toLocaleLowerCase();
  };

  const filterData = (data: IssueData[]) => {
    return data.filter((dataSet) => {
      const getDate = (date: Date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      };

      return (
        // add permissions filtering
        (selectedPlatforms.length == 0 ||
          selectedPlatforms.includes(dataSet.platform)) &&
        (selectedStatuses.length == 0 ||
          selectedStatuses.includes(dataSet.status)) &&
        (selectedSeverity.length == 0 ||
          selectedSeverity.includes(dataSet.issueSeverity)) &&
        (selectedDate == "" || getDate(dataSet.dateTime) == selectedDate) &&
        Object.values(dataSet)
          .map(String)
          .reduce(
            (accumulator, value) => accumulator || value.includes(searchQuery),
            false
          ) // make sure this is always the last check
      );
    });
  };

  const objectFromFetch = (malf: any) => {
    return new IssueData({
      ...malf,
      dateTime: new Date(malf.dateTime),
      flightNumber: malf._id,
      status: Status[malf.failureStatus],
      issueSeverity: malf.disruption
    });
  };

  return (
    <PageWrapper>
      <Box
        sx={{
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <FilterIssues
          selectedPlatform={selectedPlatforms}
          setSelectedPlatform={setSelectedPlatforms}
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          selectedSeverities={selectedSeverity}
          setSelectedSeverities={setSelectedSeverity}
          search={searchQuery}
          setSearch={setSearchQuery}
          dateSelected={selectedDate}
          setDate={setSelectedDate}
        />
        <NewMalfModel />
      </Box>
      <InfinateScroll
        properties={Object.keys(new IssueData({})).filter((property) => !property.includes("_"))}
        sortFunction={(currentValue, nextValue) =>
          nextValue.dateTime.getTime() - currentValue.dateTime.getTime()
        }
        filterFunction={filterData}
        fetchCollection="FlightFailure"
        getRowClass={getRowClass}
        color={true}
        objectFromFetch={objectFromFetch}
      />
    </PageWrapper>
  );
};

export default ManageIssues;
