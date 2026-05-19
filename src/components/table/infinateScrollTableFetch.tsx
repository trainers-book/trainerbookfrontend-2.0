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
  platformsAndFilters: { platforms: string[]; filters: any };
  objectFromFetch: (data: any) => any;
  clickable?: (row: any) => void;
  searchValue?: string;
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
  searchValue,
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

  // ✅ fetch on offset change
  useEffect(() => {
    fetchMoreData();
  }, [offset]);

  // ✅ reset when filters/platforms change
  useEffect(() => {
    setDataToShow([]);
    setOffset(0);
    setFetchMore(true);
    setFetching(false);

    fetchMoreData(0);
  }, [platformsAndFilters]);

  // ✅ THIS FIXES YOUR SEARCH BUG
  useEffect(() => {
    setDataToShow([]);
    setOffset(0);
    setFetchMore(true);
    setFetching(false);

    fetchMoreData(0);
  }, [searchValue]);

  const fetchMoreData = async (forcedOffset?: number) => {
    if (platforms.length === 0  || fetching) {
      return;
    }

    setFetching(true);

    let safePlatforms = platformsAndFilters?.platforms;

    if (!safePlatforms || safePlatforms.length === 0) {
      safePlatforms = platforms;
    }

    const currentOffset = forcedOffset ?? offset;

    const newData = await connection.getObjectsFilter(
      fetchCollection,
      currentOffset * 25,
      safePlatforms,
      searchValue
    );

    if (newData.status === HttpStatusCode.Ok) {
      const newFetchedData: any[] = newData.data;

      if (newFetchedData.length !== 0) {
        setDataToShow((prev) => {
          const existingKeys = new Set(prev.map(getRowKey));

          const mapped = newFetchedData
            .map(objectFromFetch)
            .filter((item) => !existingKeys.has(getRowKey(item)));

          const merged = [...prev, ...mapped];

          return sortFunction ? merged.sort(sortFunction) : merged;
        });
      } else {
        setFetchMore(false);
      }
    }

    setFetching(false);
  };

  const handleScroll = (event: any) => {
    if (!fetchMore || !tableRef.current || fetching) {
      return;
    }

    const children = tableRef.current.childElementCount;
    const target = event.target;

    if (
      target.scrollTop + target.offsetHeight + tableHeadHeight >=
      tableRowHeight * (children ? children : 1)
    ) {
      setOffset((prev) => prev + 1);
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