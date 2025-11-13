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
  filterFunction?: (data: any[]) => any[];
  getRowClass?: (row: IssueData) => string;
  color?: boolean;
  deleteRow?: (row: any) => void;
  getPlatformsAndFilters?: () => {platforms: string[], filters: any};
  clearFetch?: boolean;
  objectFromFetch: (data: any) => any;
}

const InfinateScrollFetch: React.FC<InfinateScrollFetchProps> = ({
  properties,
  fetchCollection,
  sortFunction,
  filterFunction,
  getRowClass,
  color,
  deleteRow,
  objectFromFetch,
  clearFetch,
  getPlatformsAndFilters
}) => {
  const tableRowHeight = 82;
  const tableHeadHeight = 56.5;

  const tableRef = useRef(null);
  const { connection } = useBackend();
  const { platforms } = usePlatforms();
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchMore, setFetchMore] = useState<boolean>(true);
  const [offset, setOffset] = useState(0);
  const [dataToShow, setDataToShow] = useState<any[]>([]);

  useEffect(() => {
    setFetching(false);
  }, [dataToShow]);

  useEffect(() => {
    fetchMoreData();
  }, [offset]);

  useEffect(() => {
    fetchMoreData();
  }, [platforms]);

  useEffect(() => {
    setDataToShow([]);
    setOffset(0);
    // setFetching(false);
    setFetchMore(true);
    fetchMoreData();
  }, [clearFetch]);

  const fetchMoreData = async () => {
    if (platforms.length == 0 || !fetchMore) {
      return;
    }

    let platformsAndFilters;
    
    if (getPlatformsAndFilters == undefined) {
      platformsAndFilters = {platforms: platforms, filters: {}}
    } else {
      platformsAndFilters = getPlatformsAndFilters();
    }

    console.log(platformsAndFilters);
    

    const newData = await connection.getObjectsFilter(
      fetchCollection,
      offset * 25,
      platformsAndFilters.platforms, // this needs to be according to the filtered platforms
      platformsAndFilters.filters // this needs to be according to the table filters
    );
    console.log(offset, newData);

    if (newData.status == HttpStatusCode.Ok) {
      const newFetchedData: any[] = newData.data;
      if (newFetchedData.length != 0) {
        setDataToShow([
          ...new Set([
            ...dataToShow,
            ...newFetchedData
              .map(
                (data) =>
                  objectFromFetch(data)
              )
              .sort(sortFunction),
          ]),
        ]);
      } else {
        setFetchMore(false);
      }
    }
  };

  const handleScroll = (event: any) => {
    if (!fetchMore) {
      return;
    }

    const children = tableRef.current.childElementCount;
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
      filterFunction={filterFunction}
      getRowClass={getRowClass}
      color={color}
      deleteRow={deleteRow}
      onScroll={handleScroll}
      tableRef={tableRef}
    />
  );
};

export default InfinateScrollFetch;
