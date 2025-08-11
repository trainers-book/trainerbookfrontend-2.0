import PageWrapper from "../components/pageWrapper/PageWrapper";
import GenericTable from "../components/table/table";
import "../types/tableTypes";
import FilterTable from "../components/filterTable/filterTable";
import { useTranslation } from "react-i18next";
import IssueData from "../types/tables/issues";
import { Status } from "../types/statuses";
import { Box } from "@mui/material";
import { platformTypes } from "../types/platformTypes";
import FilterControls from "../components/filterControl/filterControl";
import type React from "react";
import { useState } from "react";
import { useIssues } from "../context/issueContext";
import { Severity } from "../types/issuesSeverity";
import FilterSearchControl from "../components/filterControl/filterSearchControl";
import FilterDate from "../components/Dynamics/filterDate";

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

  const changePlatform = (selected: string[]) => {
    setSelectedPlatforms(selected);
  };

  const changeStatus = (selected: string[]) => {
    setSelectedStatuses(selected);
  };

  const changeSeverity = (selected: string[]) => {
    setSelectedSeverity(selected);
  };

  const changeSearch = (search: string) => {
    setSearchQuery(search);
  };

  const changedate = (selected: string) => {
    setSelectedDate(selected);
  };

  const filterData = () => {
    return issueData.filter((dataSet) => {
      const getDate = (date: Date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      }

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
          margin: 2,
        }}
      >
        <FilterTable>
          <FilterControls
            label={t("platforms")}
            options={platformTypes}
            multiple={true}
            selected={selectedPlatforms}
            setSelected={changePlatform}
          />
          <FilterControls
            label={t("status")}
            options={Object.values(Status)}
            multiple={false}
            selected={selectedStatuses}
            setSelected={changeStatus}
          />
          <FilterControls
            label={t("severity")}
            options={Object.values(Severity)}
            multiple={true}
            selected={selectedSeverity}
            setSelected={changeSeverity}
          />
          <FilterSearchControl label={t("search")} setSearch={changeSearch} />
          <FilterDate setDate={changedate} />
        </FilterTable>
      </Box>
      <GenericTable
        properties={new IssueData()}
        data={filterData()}
        sortFunction={(currentValue, nextValue) => nextValue.dateTime.getTime() - currentValue.dateTime.getTime()}
        getRowClass={getRowClass}
        color={true}
      ></GenericTable>
    </PageWrapper>
  );
};

export default ManageIssues;
