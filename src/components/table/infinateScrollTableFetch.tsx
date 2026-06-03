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
  getRowKey: (row: any) => string;
  sortFunction?: (val: any, nexVal: any) => number;
  getRowClass?: (row: IssueData) => string;
  color?: boolean;
  deleteRow?: (row: any) => void;
  platformsAndFilters: { platforms: string[]; filters: any ;search?: string} | undefined;
  objectFromFetch: (data: any) => any;
  clickable?: (row: any) => void;
}

const InfinateScrollFetch: React.FC<InfinateScrollFetchProps> = ({
  properties,
  fetchCollection,
  getRowKey,
  sortFunction,
  getRowClass,
  color,
  deleteRow,
  objectFromFetch,
  platformsAndFilters,
  clickable,
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
    if (offset > 0) {
      fetchMoreData(false);
    }
  }, [offset]);

  useEffect(() => {
    setOffset(0);
    setFetching(false);
    fetchMoreData(true);
  }, [platforms, platformsAndFilters]);

  const fetchMoreData = async (reset = false) => {
    if (platforms.length == 0 || (!fetchMore && !reset)) {
      return;
    }

    let currentFilters = platformsAndFilters;
    if (currentFilters == undefined) {
      currentFilters = { platforms: platforms, filters: {} };
    } else if (currentFilters.platforms.length == 0) {
      currentFilters.platforms = platforms;
    }

    const currentOffset = reset ? 0 : offset;

    const newData = await connection.getObjectsFilter(
      fetchCollection,
      currentOffset * 25,
      currentFilters.platforms,
      currentFilters.filters
    );

    if (newData.status == HttpStatusCode.Ok) {
      const newFetchedData: any[] = newData.data;
      if (newFetchedData.length != 0) {
        const parsed = newFetchedData
          .map((data) => objectFromFetch(data))
          .sort(sortFunction);

        setDataToShow((prev) => 
          reset ? parsed : [
            ...new Set([
              ...prev,
              ...parsed,
            ]),
          ]
        );
        setFetchMore(true);
      } else {
        if (reset) setDataToShow([]);
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
      onScroll={handleScroll}
      tableRef={tableRef}
      clickable={clickable}
      tableHeight={tableRowHeight}
    />
  );
};

export default InfinateScrollFetch;
