import "./table.css";
import "../../i18n";
import React, { useEffect, useRef, useState } from "react";
import IssueData from "../../types/tables/issues";
import { useBackend } from "../../context/backendContext";
import { usePlatforms } from "../../context/platformsContext";
import { HttpStatusCode } from "axios";
import GenericTable from "./table";

interface InfinateScrollFetchProps {
  properties: string[];
  fetchCollection: string;
  sortFunction?: (val: any, nexVal: any) => number;
  getRowClass?: (row: IssueData) => string;
  color?: boolean;
  deleteRow?: (row: any) => void;
  platformsAndFilters?: { platforms: string[]; filters: any };
  objectFromFetch: (data: any) => any;
  filterData?: (data: any[]) => any[];
  searchQuery?: string;
}

const InfinateScrollFetch: React.FC<InfinateScrollFetchProps> = ({
  properties,
  fetchCollection,
  sortFunction,
  getRowClass,
  color,
  deleteRow,
  objectFromFetch,
  platformsAndFilters,
  filterData,
  searchQuery,
}) => {
  const tableRowHeight = 82;
  const tableHeadHeight = 56.5;
  const tableRef = useRef<HTMLElement | null>(null);
  const { connection } = useBackend();
  const { platforms } = usePlatforms();
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchMore, setFetchMore] = useState<boolean>(true);
  const [offset, setOffset] = useState(0);
  const [allData, setAllData] = useState<any[]>([]);

  useEffect(() => {
    setFetching(false);
  }, [allData]);

  useEffect(() => {
    fetchMoreData();
  }, [offset]);

  useEffect(() => {
    fetchMoreData();
  }, [platforms]);

  useEffect(() => {
    setAllData([]);
    setOffset(0);
    setFetching(false);
    setFetchMore(true);
    fetchMoreData();
  }, [platformsAndFilters]);

  const fetchMoreData = async () => {
    if (platforms.length == 0 || !fetchMore) {
      return;
    }

    if (platformsAndFilters == undefined) {
      platformsAndFilters = { platforms: platforms, filters: {} };
    }

    const newData = await connection.getObjectsFilter(
      fetchCollection,
      offset * 25,
      platformsAndFilters.platforms,
      platformsAndFilters.filters
    );

    if (newData.status == HttpStatusCode.Ok) {
      const newFetchedData: any[] = newData.data;
      if (newFetchedData.length != 0) {
        const mappedData = newFetchedData.map((data) => objectFromFetch(data));
        setAllData((prev) => [...prev, ...mappedData]);
      } else {
        setFetchMore(false);
      }
    }
  };

  const dataToShow = React.useMemo(() => {
    return filterData ? filterData(allData) : allData;
  }, [allData, filterData]);

  const handleScroll = (event: any) => {
    if (!fetchMore) {
      return;
    }

    const children = tableRef.current?.childElementCount ?? 0;
    const target = event.target;

    if (
      target.scrollTop + target.offsetHeight + tableHeadHeight >=
        tableRowHeight * (children ? children : 1) &&
      !fetching
    ) {
      setFetching(true);
      setOffset(offset + 1);
    }
  };

  return (
    <GenericTable
      properties={properties}
      data={dataToShow}
      sortFunction={sortFunction}
      getRowClass={getRowClass}
      color={color}
      deleteRow={deleteRow}
      onScroll={handleScroll}
      tableRef={tableRef}
      searchQuery={searchQuery}
    />
  );
};

export default InfinateScrollFetch;
