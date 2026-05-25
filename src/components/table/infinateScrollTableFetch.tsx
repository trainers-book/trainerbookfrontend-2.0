import "./table.css";
import "../../i18n";
import React, { useEffect, useRef, useState } from "react";
import IssueData from "../../types/tables/issues";
import { useBackend } from "../../context/backendContext";
import { usePlatforms } from "../../context/platformsContext";
import { HttpStatusCode } from "axios";
import GenericTable from "./table";
import PermitData from "../../types/tables/permits";

interface InfinateScrollFetchProps {
  properties: string[];
  fetchCollection: string;
  getRowKey: (row: any) => string;
  sortFunction?: (val: any, nexVal: any) => number;
  getRowClass?: (row: IssueData | PermitData) => string;
  color?: boolean;
  deleteRow?: (row: any) => void;
  editRow?: (row: any) => void;
  platformsAndFilters?: { platforms: string[]; filters: any };
  objectFromFetch: (data: any) => any;
  clickable?: (row: any) => void;
  lengthOverride?: boolean;
  valuesOverride?: boolean;
}

const InfinateScrollFetch: React.FC<InfinateScrollFetchProps> = ({
  properties,
  fetchCollection,
  getRowKey,
  sortFunction,
  getRowClass,
  color,
  deleteRow,
  editRow,
  objectFromFetch,
  platformsAndFilters,
  clickable,
  lengthOverride,
  valuesOverride,
}) => {
  const tableRowHeight = 82;
  const tableHeadHeight = 56.5;
  const tableRef = useRef<HTMLDivElement>(null);
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
    setFetching(false);
    setFetchMore(true);
    fetchMoreData();
  }, [platformsAndFilters, fetchCollection]);

  const fetchMoreData = async () => {
    if (platforms.length == 0 || !fetchMore) {
      return;
    }

    if (platformsAndFilters == undefined) {
      platformsAndFilters = { platforms: platforms, filters: {} };
    } else if (platformsAndFilters.platforms.length == 0) {
      platformsAndFilters.platforms = platforms;
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
        setDataToShow([
          ...new Set([
            ...dataToShow,
            ...newFetchedData
              .map((data) => objectFromFetch(data))
              .sort(sortFunction),
          ]),
        ]);
      } else {
        setFetchMore(false);
      }
    }
  };

  const handleScroll = (event: any) => {
    if (!fetchMore || !tableRef.current) {
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
      getRowKey={getRowKey}
      sortFunction={sortFunction}
      getRowClass={getRowClass}
      color={color}
      deleteRow={deleteRow}
      editRow={editRow}
      onScroll={handleScroll}
      tableRef={tableRef}
      clickable={clickable}
      tableHeight={tableRowHeight}
      lengthOverride={lengthOverride}
      valuesOverride={valuesOverride}
    />
  );
};

export default InfinateScrollFetch;
