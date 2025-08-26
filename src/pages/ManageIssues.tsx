import PageWrapper from "../components/pageWrapper/PageWrapper";
import GenericTable from "../components/table/table";
import "../types/tableTypes";
import IssueData from "../types/tables/issues";
import { Status } from "../types/statuses";
import { Box } from "@mui/material";
import type React from "react";
import { useState } from "react";
import { useIssues } from "../context/issueContext";
import FilterIssues from "../components/filterTables/filterIssues";
import NewMalfModel from "../components/Popup/newMalf/newMalf";
import ExcelExport from "../components/excel/excelExport";
import { useTranslation } from "react-i18next";

const ManageIssues: React.FC = () => {
  const { t } = useTranslation();
  const { issueData } = useIssues();
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

  const filterData = () => {
    return issueData.filter((dataSet) => {
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
        <Box sx={{ display: "flex" }}>
          <NewMalfModel />
          <ExcelExport dataObject={new IssueData()} data={issueData} tableDataName={t("manageIssues")} />
        </Box>
      </Box>
      <GenericTable
        properties={Object.keys(new IssueData()).filter(() => true)}
        data={filterData()}
        sortFunction={(currentValue, nextValue) =>
          nextValue.dateTime.getTime() - currentValue.dateTime.getTime()
        }
        getRowClass={getRowClass}
        color={true}
      ></GenericTable>
    </PageWrapper>
  );
};

export default ManageIssues;
