import PageWrapper from "../components/pageWrapper/PageWrapper";
import "../types/tableTypes";
import IssueData, {
  IssueObjectFromFetch,
  getIssueColor,
} from "../types/tables/issues";
import { Status } from "../types/statuses";
import { Box } from "@mui/material";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import FilterIssues from "../components/filterTables/filterIssues";
import NewMalfModel from "../components/Popup/newMalf/newMalf";
import ExcelExport from "../components/excel/excelExport";
import { useIssues } from "../context/issueContext";
import { useTranslation } from "react-i18next";
import { usePlatforms } from "../context/platformsContext";
import InfinateScrollFetch from "../components/table/infinateScrollTableFetch";
import IssueInformation from "../components/Popup/information/issueInformation";

const ManageIssues: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<
    { minDate: Date; maxDate: Date } | undefined
  >(undefined);
  const [filterChange, setFilterChange] = useState<boolean>(true);
  const [selectedIssuePopup, setSelectedIssuePopup] = useState<
    IssueData | undefined
  >();
  const [externalUpdate, setExternalUpdate] = useState<any>(null);
  const { t } = useTranslation();
  const { issueData } = useIssues();
  const { platforms } = usePlatforms();

  useEffect(() => {
    setFilterChange(!filterChange);
  }, [selectedPlatforms, selectedStatuses, selectedSeverity, selectedDate]);

  const getPlatformsAndFilters = () => {
    const filters: {
      failureStatus: (string | undefined)[];
      minDate?: Date;
      maxDate?: Date;
    } = {
      failureStatus:
        selectedStatuses.length == 0
          ? []
          : selectedStatuses.map((status) => {
            return Object.keys(Status).find(
              (statusKey) => Status[statusKey as keyof typeof Status] === status,
            );
          }),
    };

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
        properties={Object.keys(new IssueData({})).filter(
          (property) => !property.includes("_") && property !== "goTime",
        )}
        getRowKey={(row: IssueData) => `${row.issueNumber}`}
        sortFunction={(currentValue, nextValue) =>
          nextValue.dateTime.getTime() - currentValue.dateTime.getTime()
        }
        fetchCollection="FlightFailure"
        getRowClass={getIssueColor}
        color={true}
        objectFromFetch={IssueObjectFromFetch}
        platformsAndFilters={getPlatformsAndFilters()}
        externalUpdate={externalUpdate}
        clickable={(row: IssueData) => {
          setSelectedIssuePopup(row);
        }}
      />
    );
  }, [
    selectedPlatforms,
    selectedStatuses,
    selectedDate,
    selectedSeverity,
    searchQuery,
    platforms,
    filterChange,
    externalUpdate,
  ]);

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
          <ExcelExport
            dataObject={new IssueData({})}
            data={issueData}
            tableDataName={t("manageIssues")}
          />
          <NewMalfModel platformOptions={platforms} />
        </Box>
      </Box>
      {memoTable}
      {selectedIssuePopup && (
        <IssueInformation
          isOpen={selectedIssuePopup != undefined}
          selectedRow={selectedIssuePopup}
          onClose={() => setSelectedIssuePopup(undefined)}
          onSave={(updated: any) => {
            try {
              const mapped = IssueObjectFromFetch(updated);
              setExternalUpdate(mapped);
              setSelectedIssuePopup(mapped);
            } catch {
              setSelectedIssuePopup(updated as any);
              setExternalUpdate(updated);
            }
            setFilterChange(!filterChange);
          }}
        />
      )}
    </PageWrapper>
  );
};

export default ManageIssues;
